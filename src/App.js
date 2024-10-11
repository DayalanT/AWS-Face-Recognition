import { useState } from 'react';
import './App.css';

const uuid=require('uuid');

function App() {

  const [image,setImage]=useState('');
  const [uploadResultMessage,setUploadResultMessage]=useState('Please enter an image to authenticate');
  const [visitorName,setVisitorName]=useState('placeholder.jpeg');
  const [isAuth,setAuth]=useState(false);

  function sendImage(e){
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName=uuid.v4();
    fetch(`https://avx1qituy7.execute-api.eu-west-2.amazonaws.com/dev/dcutvisitors/${visitorImageName}.jpg` ,{
      method:'PUT',
      headers:{
        'Content-Type':'image/jpg'
      },
      body:image
    }).then(async()=>{
      const response=await authenticate(visitorImageName);
      if(response.Message==='Success'){
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to work, have a productive day`)
      }else{
        setAuth(false);
        setUploadResultMessage(`Authentication Failed`)
      }
    }).catch(error=>{
      setAuth(false);
      setUploadResultMessage(`There is an error in authentication process,try again llater.`)
      console.error('Error uploading image:', error);
    })
  }

  async function authenticate(visitorImageName){
    const requestUrl='https://avx1qituy7.execute-api.eu-west-2.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey:`${visitorImageName}.jpg`
    });
    return await fetch(requestUrl,{
      method:'GET',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    }).then(response=>response.json())
    .then((data)=>{
      return data;
    }).catch(error=>console.error(error));
  }

  return (
    <div className="App">
    <h2>FACIAL RECOGNITION SYSTEM</h2>
    <form onSubmit={sendImage}>
      <input type='file' name='image' onChange={e=> setImage(e.target.files[0])} />
      <button type='submit'>Authenticate</button>
    </form>

    <div className={isAuth? 'success':'failure'}>{uploadResultMessage}</div>
    <img src={require(`./visitors/${visitorName}`)} alt='Visitor' height={250} width={250} />
    </div>
  );
}

export default App;
