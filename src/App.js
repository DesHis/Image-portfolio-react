import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import axios, { Axios } from 'axios';

import CloseButton from 'react-bootstrap/CloseButton'

const headerText="SITE HEADER"
const siteText="site text here"


//const backendURL="http://localhost:3001"
const backendURL="http://"+window.location.host

const ImageRow=(props)=>{
  switch (props.imgList.length) {
    case 1:
      return(
        <div className="imgRow">
        <Image imgUrl={backendURL+"/images/"+props.imgList[0]} setState={props.setState}/>
        <Image/>
        <Image/>
        </div>
      )
    case 2:
      return(
        <div className="imgRow">
        <Image imgUrl={backendURL+"/images/"+props.imgList[0]} setState={props.setState}/>
        <Image imgUrl={backendURL+"/images/"+props.imgList[1]} setState={props.setState}/>
        <Image/>
        </div>
      )
    default:
      return(
        <div className="imgRow">
        <Image imgUrl={backendURL+"/images/"+props.imgList[0]} setState={props.setState}/>
        <Image imgUrl={backendURL+"/images/"+props.imgList[1]} setState={props.setState}/>
        <Image imgUrl={backendURL+"/images/"+props.imgList[2]} setState={props.setState}/>
        </div>
      )
  }

}

const Image=(props)=>{
  function clickImage(){
    props.setState(props.imgUrl);
  }
  return(
    <div className="imageOuter">
      <div className="imageInner">
        <img src={props.imgUrl} alt="" onClick={clickImage}></img>
      </div>
    </div>
  )
}

const Header = (props) => {
  return(
  <>
    <h1> {props.text} </h1>
  </>
  )
}

const Paragraph = (props) => {
  return(
  <>
    <p> {props.text} </p>
  </>
  )
}

const BigImage = (props) => {

  if(props.imgUrl!==null&&props.imgUrl!==undefined){
    const title=props.description[0]
    const description=props.description[1]
  return(<>
    <div className="dimBackground" onClick={()=>{props.setBigImage(null)}}></div>
    <div className="bigImage" onClick={(e)=>{if(e.target===e.currentTarget){props.setBigImage(null)}}}>
      <div className="close"><CloseButton variant="white" onClick={()=>{props.setBigImage(null)}}/></div>
        <div className="image">
          <img src={props.imgUrl} alt=""></img>
        </div>
      <div className="title"><Header text={title}/><Paragraph text={description}/></div>
      <div className="previous" onClick={()=>{props.prevImage()}}><p>Previous</p></div>
      <div className="next" onClick={()=>{props.nextImage()}}><p>Next</p></div>
    </div>
  </>)
  }else{
    return(
      <></>
    )
  }
}

const App=()=>{
  const [isLoading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [bigImage, setBigImage] = useState();
  const [bigImageDescription, setBigImageDescription] = useState();

  function imageClicked(bigImageUrl){
    setBigImage(bigImageUrl)
    try{
      let arr = Object.values(descriptions.find(o=>o.imageName===bigImageUrl.split("/").pop()))
      arr.shift()
      setBigImageDescription(arr)
    }catch(error){
      setBigImageDescription(["title","description"])
    }
   }
   
   function nextImage(){
    let index=images.indexOf(bigImage.substring(bigImage.lastIndexOf('/')+1))
    if(index===images.length-1){
      index=0
    }else{
      index=index+1
    }
    let URL=backendURL+"/images/"+images[index]
    imageClicked(URL)
   }

   function prevImage(){
    let index=images.indexOf(bigImage.substring(bigImage.lastIndexOf('/')+1))
    if(index===0){
      index=images.length-1
    }else{
      index=index-1
    }
    let URL=backendURL+"/images/"+images[index]
    imageClicked(URL)
   }

  useEffect(() => {
  axios.get(backendURL+"/imageList").then(response => {
    setImages(response.data.filter(e => e !== 'descriptions.json'));
    setLoading(false);
  });
  }, [])

  useEffect(() => {
    axios.get(backendURL+"/images/descriptions.json").then(response => {
      setDescriptions(response.data["data"]);
    });
  }, [])

  let imgArrays=[]
  let clone = images.slice(0)
  let index=0
  while (clone.length > 0) {
    imgArrays[index] = clone.splice(0,3)
    index=index+1
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

return(
  <div className="site">
        <Header text={headerText}/>
        <Paragraph text={siteText}/>
        {imgArrays.map((imgs, index) =><ImageRow imgList={imgs} key={index} setState={imageClicked}/>)} 
        <BigImage imgUrl={bigImage} description={bigImageDescription} setBigImage={setBigImage} nextImage={nextImage} prevImage={prevImage}/>
  </div>
)
}

export default App;