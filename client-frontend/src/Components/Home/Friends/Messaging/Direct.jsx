import React, { useEffect, useState, useRef } from 'react';
import './direct.css';
import { useParams, Link } from 'react-router-dom';
import { TextField } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

function Direct() {

  const { otherUser_id } = useParams();
  const [ directs, setDirects ] = useState([]);
  const prevDate = useRef(new Date("January 1, 1970"));
  const messageInput = useRef("");
  const [ message, setMessage ] = useState("");
  const [ picture, setPicture ] = useState("");
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if(lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [directs])

  useEffect(() => {
    const options = {
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      })
    }
    fetch(`http://127.0.0.1:4000/message/readAllFrom/${otherUser_id}`, options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setDirects(data)
      })
      .catch(err => err.message)
  }, [])

  const sendMessage = async () => {
    if (!(message !== "" || picture !== "")) return;

    const s3Url = "http://127.0.0.1:4000/utilities/s3-url"
    let pictureUrl = "";

    if (picture) {
        const uploadUrl = await fetch(s3Url).then(res => res.json());
        console.log(uploadUrl);

        await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: picture
        }).then(res => console.log(res));

        const imgUrl = uploadUrl.split("?")[0];
        pictureUrl = `data-image:::${imgUrl}`;
    }

    const options = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "authorization": localStorage.getItem("token")
      }),
      body: JSON.stringify({ body: message === "" ? pictureUrl : message })
    }

    fetch(`http://127.0.0.1:4000/message/makePostTo/${otherUser_id}`, options)
      .then(res => res.json())
      .then(data => {
        console.log(data.newMessage)
        setDirects([...directs, data.newMessage])})
      .catch(err => err.message)
    
    setMessage("");
    setPicture("");
    prevDate.current = new Date("January 1, 1970");
  }

  const addDateLine = (date) => {
    const newDate = dayjs(date).format("MM/DD/YYYY");
    return (<div key={date} className="datestamp"><div className="line"></div><p className="normal-text">{newDate}</p><div className="line"></div></div>)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setPicture(file);
    prevDate.current = new Date("January 1, 1970");
  }

  const removeImg = () => {
    setPicture("");
    prevDate.current = new Date("January 1, 1970");
  }
  
  return (
    <div id="direct-page">
      <div id="direct-header">
        <Link to="/inbox">
          <ArrowBackIosIcon
            id="direct-back-btn"
            htmlColor='#7E12B3'
            fontSize={"large"}
          />
        </Link>
        <MoreHorizIcon onClick={null} id="new-direct-btn" htmlColor='#7E12B3' fontSize={"large"} />
        <h1>{!directs[0] ? null : directs[0].sender._id === otherUser_id ? directs[0].sender.bandName : directs[0].receiver.bandName }</h1>
      </div>
      { !directs
        ? <h1>loading</h1>
        : directs.length === 0
        ? null
        : <div id="direct-list">
            { directs.map((direct, i) =>
              <div key={i}>
              { addDateLine(direct.createdAt ? direct.createdAt : new Date())}
              <div className="direct-item">
                
                <div className="direct-img-container">
                  <img src={direct.sender.profilePicture ? direct.sender.profilePicture : "/blank.png" } alt="profile pic" />
                </div>

                <div className="direct-text">
                  <div className="direct-top">
                    <h3>{direct.sender.bandName}</h3>
                    <p className="normal-text">{ direct.createdAt ? dayjs(direct.createdAt).format("h:mm a") : null }</p>
                  </div>

                  { direct.body.split(":::")[0] === "data-image"
                      ? <img src={direct.body.split(":::")[1]} alt="message image" />
                      : <p className="normal-text">{direct.body}</p> }
                </div>
              </div>
            </div>
        )}</div>
      }
      <div id="footer-textbox">
        { picture !== ""
          ? <div id="direct-preview-photo">
              <img src={URL.createObjectURL(picture)} alt="preview-photo" />
            </div>
          : null
        }
        <div id="footer-wrap">
          { picture !== ""
            ? <CloseIcon htmlColor='#7E12B3' onClick={e => removeImg()} fontSize={"large"} />
            : <label htmlFor="file-upload">
                <AttachFileIcon id="clip" htmlColor='#7E12B3' fontSize="large" />
              </label>
          }
          <input
            type="file"
            id="file-upload"
            name="file-upload"
            accept='.jpeg, .jpg, .png'
            onChange={(e) => handleFileUpload(e)}
          />
          <TextField
            disabled={picture !== ""}
            id="direct-input"
            ref={messageInput}
            label={picture !== "" ? "Send attactment" : "Write a message..." }
            variant="outlined"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={ e => e.key === "Enter" ? sendMessage() : null }
            fullWidth={true}
          ></TextField>
          <SendIcon onClick={e => sendMessage()} htmlColor='#7E12B3' fontSize="large" />
        </div>
      </div>
    </div>
  )
}

export default Direct