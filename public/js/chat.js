const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messageFormLocation = document.querySelector('#location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true});
const autoScroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild;
    //height of last message
    const newMessageStyle = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    //Visible Height
    const visibleHeight = $messages.offsetHeight;
    //Height of messages container
    const contentHeight = $messages.scrollHeight;
    //how far have the user scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(contentHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop = $messages.scrollHeight;
    }
    console.log(newMessageMargin);
}


//render the current location
socket.on('locationMessage', (message)=>{
    //console.log(url);
    const locHtml = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',locHtml);
    autoScroll();
});

//render the chat message
socket.on('Message', (message)=>{
    //console.log(message);
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
});

//render the user list in the particular room
socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room, users
    });
    document.querySelector('#sidebar').innerHTML = html;
})



//submit the message from user
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled','disabled');//this disables the form once form is submitted
    //disable
    const message = e.target.elements.msg.value;
    socket.emit('sendMessage', message, (error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value='';
        $messageFormInput.focus();
        //enable

        if(error){
            return console.log(error);
        }
        
        //console.log('The message was delivered');
    });
});

//geting the location
$messageFormLocation.addEventListener('click',()=>{
    //disable code
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by browser');
    }
    $messageFormLocation.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            $messageFormLocation.removeAttribute('disabled');
            //console.log('Location Shared!');
        })
    });
})

//use socket.io to join room
socket.emit('join', {username, room}, (error) =>{
    if(error){
        alert(error);
        location.href='/'
    }
})