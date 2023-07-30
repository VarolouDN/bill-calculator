import {useState} from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children,onClick,setIsSelected,isSelected,handleChooseFriend,friend,handleShowAddFriend}){



  return <button onClick={onClick} className='button' >{children}</button>
}

export default function App(){

  const[showAddFriend,setShowAddFriend]=useState(false)
  const[friends,setFriends]=useState(initialFriends)
  const[selectedFriend,setSelectedFriend]=useState(null)




  function handleSelection(friend){

   setSelectedFriend(prev=>selectedFriend?.id===friend.id?null:friend)
   setShowAddFriend(false)

  }

  function handleChangeFriends(friend){
    setFriends(prev=>[...prev,friend])
    setShowAddFriend(false)
  }
//--------------------------------------------------
  function changeFriends(id,newBalance){

   setFriends(prev=> friends.map(friend=>friend.id===id?({...friend,balance:(friend.balance+newBalance)}):friend)

   )
setSelectedFriend(null)
  }
  console.log(friends)
//------------------------------------------------
  function handleShowAddFriend(){
    setShowAddFriend(prev=>!prev)

  }

console.log(selectedFriend)
  return <div className='app'>
    <div className='sidebar'>
    <FriendsList handleSelection={handleSelection} selectedFriend={selectedFriend} friends={friends}/>

      {showAddFriend && <FormAddFriend handleChangeFriends={handleChangeFriends} />}
      <Button onClick={handleShowAddFriend}>{showAddFriend?"Close":"Add friend"}</Button>
    </div>

    { selectedFriend && <FormSplitBill changeFriends={changeFriends} selectedFriend={selectedFriend}/>}
  </div>
}

function FriendsList({friends,handleSelection,selectedFriend}){

return <ul>
  {
    friends.map(friend=>{
   return    <Friend handleSelection={handleSelection} key={friend.id} friend={friend}
                     selectedFriend={selectedFriend}/>
    })
  }
</ul>
}


function Friend({friend,handleSelection,selectedFriend}){
console.log(selectedFriend)

const isSelected=selectedFriend?.id===friend.id
console.log(isSelected)
  return <li className={isSelected ? 'selected':''}>
    <img src={friend.image} alt={friend.name}/>
     <h3>{friend.name}</h3>

    {friend.balance<0 && <p className='red'>You owe {friend.name} {Math.abs(friend.balance)}€</p>}
    {friend.balance>0 && <p className='green'>{friend.name} owes you {Math.abs(friend.balance)}€</p>}
    {friend.balance===0 && <p >You and {friend.name} are even</p>}


    <Button onClick={()=>handleSelection(friend)}
            friend={friend}>{isSelected?'Close':'Select'}</Button>
  </li>
}



function FormAddFriend({handleChangeFriends}){


  const [name,setName]=useState('')
  const[image,setImage]=useState(('https://i.pravatar.cc/48'))


  function handleSubmit(e){
    e.preventDefault()
    if(name===''){
      return
    }
    const id=crypto.randomUUID()
    const friend=  {
      id,
      name,
      image:`${image}?=${id}`,
      balance: 0,
    }
    handleChangeFriends(friend)
    console.log(friend)
    setName(prev=>'')
    setImage(prev=>'https://i.pravatar.cc/48')
  }

  return  <form className='form-add-friend' onSubmit={handleSubmit}>

    <label>Friend name</label>
    <input  value={name} onChange={e=>setName(e.target.value)} type='text'/>

    <label> Image URL</label>
    <input value={image} onChange ={e=>setImage(e.target.value)} type='text'/>
    <Button >Add</Button>
  </form>
}

function FormSplitBill({selectedFriend,changeFriends}){

  const[bill,setBill]=useState('')
  const[paidByUser,setPaidByUser]=useState('')
  const paidByFriend=bill  ?bill-paidByUser:''
  const[whoIsPaying,setWhoIsPaying]=useState('user')
  let newBalance
  function handleSubmit(e){
    e.preventDefault()
    if(!bill || !paidByUser){
      return
    }
    if(whoIsPaying==='friend'){
      newBalance=-paidByUser
    }
    else{
      newBalance=paidByFriend
    }

    changeFriends(selectedFriend.id,newBalance)
  // const newBalance=bill/2-paidByUser
  }


  return <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
    <label>💼Bill value</label>
    <input value={bill} onChange={e=>setBill(+e.target.value)} type='text'/>

    <label>👩🏼‍🤝‍🧑🏿Your expense</label>
    <input type='text' value={paidByUser} onChange={e=>setPaidByUser(+e.target.value<=bill?+e.target.value:paidByUser)} />

    <label>👩🏾‍🤝‍👩🏼 {selectedFriend.name}'s expense</label>
    <input type='text' disabled value={paidByFriend}/>

    <label>🙂Who is paying the bill?</label>
    <select value={whoIsPaying} onChange={e=>setWhoIsPaying(e.target.value)}>
      <option value='user'>You</option>
      <option value='friend'>{selectedFriend.name}</option>
    </select>
    <Button>Split Bill</Button>
  </form>
}