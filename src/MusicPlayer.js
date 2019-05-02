import React, { Component } from 'react';
import axios from 'axios';



export default class MusicPlayer extends Component{
    constructor(props){
        super(props);
        this.state = {
            query: [],
            artist: null,
			profilepic: null,
			listeners: null,
			playcount: null,
			description: null,
			tracks: [],
			playingUrl: '',
			audio: null,
			playing: false

        }
    }

    search() {
		console.log(this.state.query);
        var baseURL = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${this.state.query}&api_key=571531f3f347aabde16d01f3340d1aa0&format=json`;
		console.log(baseURL);
        axios.get(baseURL)
        .then(res => {
            console.log(res.data.artist)
            const artist = res.data.artist['name'];
            // const artist = artist.name
            this.setState({
                 artist :res.data.artist['name'],
                 profilepic : res.data.artist.image[2]['#text'],
                 listeners : res.data.artist.stats['listeners'],
                 playcount : res.data.artist.stats['playcount']
                 
                
            })

				var albumURL = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&api_key=571531f3f347aabde16d01f3340d1aa0&format=json`;
				console.log(albumURL);
                axios.get(albumURL)
                .then(res => {
                    const tracks = res.data.toptracks['track'];
                      this.setState({ 
                            tracks : res.data.toptracks['track']
                        });
                    console.log(res.data)
                  })


			 });


	}
	playAudio(previewUrl) {
		let audio = new Audio(previewUrl);
		if (!this.state.playing) {
			audio.play();
			this.setState({
				playing: true,
				playingUrl: previewUrl,
				audio
			})
		} else {
			if (this.state.playingUrl === previewUrl) {
				this.state.audio.pause();
				this.setState({
					playing: false
				})
			} else {
				this.state.audio.pause();
				audio.play();
				this.setState({
					playing: true,
					playingUrl: previewUrl,
					audio
				})
			}
		}
	}

   
    render(){
        
        return (
			<div  className="mainpage ">
            <h1 className="heading">Seacrh for your Favourite Artist</h1>
        
                <div className="">
				  <div className="">
						<div className="search">
                           <input type="text" className="form-control" className="form-control text-center" placeholder="Enter Any Artist to search box" required onChange={event => this.setState({ query: event.target.value })} onKeyPress={event => { if (event.key === 'Enter') this.search() } } />
                           <button class="exit" type="reset"></button>
						</div>
					</div>
				</div>
				<div className="row ">
					<div className="">
					</div>
					<div>
						<div className="">
							<img className="img-responsive" src={this.state.profilepic} alt='' />
                            
						</div>
						<div className="">
							<h3 className="">{this.state.artist}</h3>
							<span className="">listeners:{this.state.listeners}</span>
                            <hr></hr>
							<span className="">playcount:{this.state.playcount}</span>  
						</div>
					</div>
				</div>

				<div className="">
					<div className="">
					</div>
					<div className="tracklist wrapper">
						<ul className="tracks">
							{
								this.state.tracks.map(function (track, index) {
								
									return <li className='well' key={index}> 
                                    <img className="img-responsive imagealbum" src={track.image[0]['#text']} alt='' />
                                    <a href={track.url} target="_blank" >{track.name} </a></li>;
                                })}
                                
						</ul>
					</div>
					<div>
					</div>
				</div>
			</div>)
	
    }
}