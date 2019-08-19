const users = []

//addUser, removeUser, getUser, getUsersInRoom
const addUser = ({id, username, room}) =>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //validate data
    if(!username || !room){
        return {
            error: 'Username & Room are required'
        }
    }
    //check for existing user
    const existingUser = users.find((user)=> {
        return user.room === room && user.username === username
    })
    //Validate username
    if(existingUser){
        return {
            error: 'Username is already taken!!'
        }
    }
    //Store user
    const user = {id,username,room};
    users.push(user);
    return { user };
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id;
    });
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}
//get Users 
const getUser = (id) => {
    return users.find((user)=>user.id === id);
}

//get user in particular room
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user)=>user.room === room);
}

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}