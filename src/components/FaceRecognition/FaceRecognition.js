import React from 'react';
import "./FaceRecognition.css";

const FaceRecognition = ({imageUrl, box}) => {
	const boxList = box.map(data=>{
		return <div className="bounding-box" style={{top:data.topRow, right: data.rightCol, bottom: data.bottomRow, left: data.leftCol}}></div>
	})
	return (
		<div className="center ma">
			<div className="absolute mt2">
				<img id="inputImage" src={imageUrl} alt="Dummy" width="500px" height="auto"/>
				{boxList}
			</div>
		</div>
	);
}
export default FaceRecognition;