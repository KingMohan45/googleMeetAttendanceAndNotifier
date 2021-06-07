let person_details=Array(4),subjectName,sectionName,aNodes,rNodes,peopleParent;
let windowLocation=window.location.toString();
let meetingCode=windowLocation.substring(windowLocation.indexOf(".com/")+5,windowLocation.indexOf("?")==-1?windowLocation.length:windowLocation.indexOf("?"))
for(let i=0;i<4;i++){
	person_details[i]=Array();
}
let chatObserver=new MutationObserver(function(mutationRecord){
	mutationRecord.forEach((mutation)=>{
		if(mutation.addedNodes.length>0){
		//message=m[0].addedNodes[0]
			mutation.addedNodes.forEach((content)=>{
				let name,message=content.textContent;
				if(content.attributes["data-sender-name"]){
					name=content.attributes["data-sender-name"].textContent
					message=message.slice(message.indexOf(name)+name.length);
					if(message.indexOf("M")==-1){
						message=message.slice(message.indexOf(":")+3);
					}
					else{
						message=message.slice(message.indexOf("M")+1);
					}
				}
				else{
					name=document.querySelector(".z38b6.CnDs7d.hPqowe").lastChild.attributes["data-sender-name"].textContent
				}
				if(name!="You"){
					let notify=new Notification((sectionName?(sectionName+"_"):"")+name,{
			          body:message
			        })
		        	setTimeout(()=>{notify.close()},4000)
			    }
			})
		}
	})
})
/*let handRaiseObserver=new MutationObserver((mutationRecord)=>{
	mutationRecord.forEach((mutation)=>{
    	mutation.addedNodes.forEach((person)=>{
      		let name=person.children[0].textContent;
	      	if(name.indexOf("(You)")==-1){
	        	let notify=new Notification((sectionName?(sectionName+"_"):"")+name,{body:"RaisedHand"})
	        	setTimeout(()=>{notify.close()},4000)
		    }
	    })
	})
})*/
/*let handRaiseBox=new MutationObserver((mutationRecord)=>{
  	mutationRecord.forEach((mutation)=>{
		mutation.addedNodes.forEach((addedNode)=>{	
			if(addedNode.classList.contains("GvcuGe")){
				handRaiseObserver.observe(addedNode,{childList:true})
				if(addedNode.children.length>1){
					let notify=new Notification("Two or more people raised hands");
					setTimeout(()=>{notify.close()},4000)
				}
				else{
					let name=addedNode.children[0].children[0].textContent;
					if(name.indexOf("(You)")==-1){
	        			let notify=new Notification((sectionName?(sectionName+"_"):"")+name,{body:"RaisedHand"})
	        			setTimeout(()=>{notify.close()},4000)
		    		}
				}
			}
		})
		mutation.removedNodes.forEach((removedNode)=>{
			if(addedNode.classList.contains("GvcuGe")){
				handRaiseObserver.disconnect()
			}
		})
	});
})*/
let peopleObserver = new MutationObserver(function(mutationRecord){
	aNodes=[],rNodes=[];
	mutationRecord.forEach((mutation)=>{
	    mutation.removedNodes.forEach((removed_node)=>{
	    	rNodes.push(removed_node);
	    })
	})
	mutationRecord.forEach((mutation)=>{
	    mutation.addedNodes.forEach((inserted_node)=>{
	    	let index=rNodes.indexOf(inserted_node);
	    	if(index==-1){
	    		aNodes.push(inserted_node);
	    	}
	    	else{
	    		rNodes.splice(index,1);
	    	}
	    })
	})
	aNodes.forEach((inserted_node)=>{
    	let name=inserted_node.children[0].textContent;
    	let index=person_details[0].indexOf(name);
    	if(index==-1){
    		person_details[0].push(name);
			person_details[1].push(0);
			if(document.getElementById('start_stop').classList.contains('recording')){
				person_details[2].push(Date.now())
			}
			else{
				person_details[2].push(0);
			}
			person_details[3].push(1);
    	}
    	else{
    		if(person_details[2][index]==0){
				if(document.getElementById('start_stop').classList.contains('recording')){
					person_details[2][index]=Date.now()
				}
	    		person_details[3][index]=1;
    		}
    		else{
    			person_details[3][index]++;
    		}
    	}
	})
	rNodes.forEach((deleted_node)=>{
    	let name=deleted_node.children[0].textContent;
    	let index=person_details[0].indexOf(name);
    	if(!--person_details[3][index]){
    		if(person_details[2][index]!=0){
    			person_details[1][index]+=(Date.now()-person_details[2][index])/60000;
    		}
			person_details[2][index]=0;
    	}
	})
})
/*let emergencyObserver=new MutationObserver((mutationRecord)=>{
  	mutationRecord.forEach((mutation)=>{
    	mutation.addedNodes.forEach((addedNode)=>{
      		if(addedNode.classList.contains("TqTEJc")){
      			let notify=new Notification("Internet fluctuating.");
      			setTimeout(()=>{notify.close()},4000)
      			close_sessions();
      			person_details[3].forEach((value,index)=>{
      				if(value){
      					person_details[3][index]=0;
      				}
      			})
      		}
    	})
    	mutation.removedNodes.forEach((removedNode)=>{
	    	if(removedNode.classList.contains("TqTEJc")){
    			setTimeout(()=>{
					initiatePage(false);
    			},5000);
	      	}
    	})
	})
})*/
function storeDataInCookie(){
	close_sessions();
	open_sessions();
	meetingData=[subjectName,sectionName,person_details[0],person_details[1]]
	let expireDate=new Date();
	expireDate.setTime(expireDate.getTime()+60*60*1000);
	document.cookie=meetingCode+"="+JSON.stringify(meetingData)+";expires="+expireDate.toGMTString()+";";
}
function readCookie(){
	let documentCookie=document.cookie.split(";");
	for(let i=0;i<documentCookie.length;i++){
		if(documentCookie[i].startsWith(" "+meetingCode)){
			return JSON.parse(documentCookie[i].substring(documentCookie[i].indexOf("=")+1))
		}
	}
	return null;
}
function open_sessions()
{
	person_details[0].forEach((dummy,index)=>{
		if(person_details[3][index]){
			person_details[2][index]=Date.now();
		}
	})
}
function close_sessions()
{
	person_details[0].forEach((dummy,index)=>{
		if(person_details[2][index]!=0){
			person_details[1][index]+=(Date.now()-person_details[2][index])/60000;
			person_details[2][index]=0;
		}
	})
}
function downloadData(filename,final_data){
    
    let blob = new Blob([final_data], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    let url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function initiateDownload()
{
	let csvFile = "ID,Name,Total_time\n";
    for (let i = 0; i < person_details[0].length; i++) {
    	let tMin=person_details[1][i]+(person_details[2][i]==0?0:(Date.now()-person_details[2][i]))/60000
    	let name=person_details[0][i],noNums=6,id=name.charAt(0),j;
    	for(j=1;j<name.length;j++){
    		let cCode=name.charCodeAt(j);
    		if(cCode>=48 && cCode<=57){
    			id+=name.charAt(j);
    			if(!--noNums){
    				break;
    			}
    		}
    		else if((cCode>=65 && cCode<=90) || (cCode>=97 && cCode<=122)){
    			if(j==1){
    				id=name.charAt(j)+id;
    				continue;
    			}
    			break;
    		}
    	}
    	if(noNums!=0){
        	csvFile += ","+name.trim()+","+Math.floor(tMin)+":"+Math.floor(((tMin*100)%100)*0.6)+"min\n";
    	}
    	else{
    		csvFile += id+","+name.substring(j+1).trim()+","+Math.floor(tMin)+":"+Math.floor(((tMin*100)%100)*0.6)+"min\n";
    	}
    }
    date=new Date();
	downloadData(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+"_"+"attendance"+".csv",csvFile);
}
function performAction(action){
	if(action=="Submit"){
		if(document.getElementById('input1').value){
			subjectName = document.getElementById('input1').value;
		}
		if(document.getElementById('input2').value){
			sectionName = document.getElementById('input2').value;
		}
	}
	let element=document.getElementById("dataInputElement");
	element.parentElement.removeChild(element);
	storeDataInCookie();
	setInterval(()=>{
		storeDataInCookie();
	},60000)
}
function openSideBar(){
	if(document.getElementsByClassName("u7qdSd w60wqc").length>0 || document.getElementsByClassName("u7qdSd BB6Rdd").length>0){
		return;
	}
	let buttons=document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc");
	if(buttons.length>0){
		for(let i=0;i<buttons.length;i++){
			if(buttons[i].attributes["aria-label"].value=="Show everyone"){
				clearInterval(pageIniInterval);
				if(i+1<buttons.length)	buttons[i+1].click();
				setTimeout(()=>{buttons[i].click();},1000);
				setTimeout(initiatePage,5000);
				return;
			}
		}
		alert("Something went wrong. Extention Error code- BTN-ERR. Contact developer if possible");
	}
	else{
		alert("Looks like, this is Legacy version(old) of Google meet. For this meet install legacy version of the extension. If not let developer know this. Thank you.");
	}
	clearInterval(pageIniInterval);
}
function initiatePage()
{
	/*document.getElementsByClassName("loWbp")[0].onclick=()=>{
		setTimeout(()=>{
		  if(document.getElementsByClassName("rG0ybd")[0].offsetWidth==document.body.offsetWidth){
		    sideBar.style.right="-"+sideBar.offsetWidth+"px";
		  }
		},400)
	}
	document.getElementsByClassName("uArJ5e UQuaGc kCyAyd QU4Gid foXzLb")[0].onclick=()=>{
		sideBar.style.right="0px"
	}
	document.getElementsByClassName("uArJ5e UQuaGc kCyAyd QU4Gid foXzLb")[1].onclick=()=>{
		sideBar.style.right="0px";
	}*/
	
	//show buttons;
	if(document.getElementsByClassName("CYZUZd").length>0){
		var controls=document.getElementsByClassName("cZG6je")[0];
		let downloadBtn=document.createElement("div");
		let pausePlay=document.createElement("div");
		controls.insertBefore(downloadBtn,controls.children[0]);
		controls.insertBefore(pausePlay,controls.children[0]);
		downloadBtn.outerHTML='<div id="downloadFile" class="a1GRr PjGUeb" style="width:45px;height45px;margin:5px;cursor:pointer"><svg enable-background="new 0 0 32 32" id="Слой_1" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="border-radius: 50%;height: 30px;background: #618eca;padding: 5px;"><path clip-rule="evenodd" d="M26.704,20.393  c-0.394-0.39-1.034-0.391-1.428,0l-8.275,8.193V1c0-0.552-0.452-1-1.01-1s-1.01,0.448-1.01,1v27.586l-8.275-8.192  c-0.394-0.391-1.034-0.391-1.428,0c-0.394,0.391-0.394,1.024,0,1.414l9.999,9.899c0.39,0.386,1.039,0.386,1.429,0l9.999-9.899  C27.099,21.417,27.099,20.784,26.704,20.393C26.31,20.003,27.099,20.784,26.704,20.393z" fill="#121313" fill-rule="evenodd" id="Arrow_Download"></path></svg></div>'
		pausePlay.outerHTML='<div id="start_stop" class="a1GRr PjGUeb" style="width:45px;height45px;margin:5px;cursor:pointer"><svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style="border-radius: 50%;height: 30px;background: #618eca;padding: 5px;"><path d="M-838-2232H562v3600H-838z" fill="none"></path><path d="M16 10v28l22-14z"></path><path d="M0 0h48v48H0z" fill="none"></path></svg> </div>'

		document.getElementById('start_stop').addEventListener("click",function(){
			if(this.classList.contains('recording')){
				this.innerHTML='<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style="border-radius: 50%;height: 30px;background: #618eca;padding: 5px;"><path d="M-838-2232H562v3600H-838z" fill="none"></path><path d="M16 10v28l22-14z"></path><path d="M0 0h48v48H0z" fill="none"></path></svg>'
				close_sessions();
			}
			else{
				this.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause-circle" style="width: 45px;"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>'
				open_sessions();
			}
			this.classList.toggle("recording");
		})
		document.getElementById('downloadFile').addEventListener("click",function(){
			console.log("Download initiated");
			initiateDownload();
		})
	}
	else{
		alert("Something went wrong. Error code BTN-FAILURE.3");
	}
	//buttons end

	//Notification compatibility check
	if(!window.Notification)
	{
		alert("Your browser won't support desktop notifications");
	}

	//Notification compatibility check
	if(!window.Notification)
	{
		alert("Your browser won't support desktop notifications");
	}
	else
	{
		//chat messages observer
		/*let chatParentElement=document.querySelector(".z38b6.CnDs7d.hPqowe");
		if(chatParentElement!=null){
			chatObserver.observe(chatParentElement,{childList:true,subtree:true})
		}*/
		let message="You can now see messages by notifications";
		let chatParentElement=document.getElementsByClassName("z38b6 CnDs7d hPqowe");
		if(chatParentElement.length==1){
			chatObserver.observe(chatParentElement[0],{childList:true,subtree:true})
		}
		else{
			message="Due to some issue message notifications can't be displayed. Check manually. Contact developer"
		}
		if(Notification.permission!='granted'){
			alert(message)
			Notification.requestPermission()
		}
		else if(Notification.permission=='granted')
		{
			let testNotify=new Notification(message);
			setTimeout(()=>{testNotify.close()},4000)
		}
	}

	/*//hand-raise observer
	if(document.getElementsByClassName("GvcuGe")[0].attributes["aria-label"].textContent=="Raised hands"){
	  handRaiseObserver.observe(document.getElementsByClassName("GvcuGe")[0],{childList:true})
	}

	//hand-raise box observer for first/fresh(one) hand-raise
	handRaiseBox.observe(document.getElementsByClassName("ggUFBf")[0].children[0],{childList:true})*/

	//selecting people parent class and then select people parent
	let peopleParentClass=document.getElementsByClassName("GvcuGe"),peopleParent;
	for(let i=0;i<peopleParentClass.length;i++){
		if(peopleParentClass[i].attributes["aria-label"] && peopleParentClass[i].attributes["aria-label"].value=="Participants"){
			peopleParent=peopleParentClass[i];
			console.log("People parent element detected");
			break;
		}
	}
	if(peopleParent==null){
		alert("Something wrong, feel free to contact to resolve the issue. Take attendance manually for now.")
		return;
	}
	peopleParent.childNodes.forEach((element)=>{
		if(element.attributes.role!=null){
			let name=element.childNodes[0].textContent;
			let index=person_details[0].indexOf(name);
			if(index==-1){
				person_details[0].push(name);
				person_details[1].push(0);
				if(document.getElementById('start_stop').classList.contains('recording')){
					person_details[2].push(Date.now())
				}
				else{
					person_details[2].push(0);
				}
				person_details[3].push(1);
			}
			else{
				if(document.getElementById('start_stop').classList.contains('recording')){
					person_details[2].push(Date.now())
				}
				person_details[3][index]++;
			}
		}
	})
	document.getElementById('start_stop').click();
	peopleObserver.observe( peopleParent, { childList:true})

	//emergency observer
	/*emergencyObserver.observe(document.getElementsByClassName("crqnQb")[0],{childList:true})*/
/*
	if(!showPopup){
		return;
	}*/
	//notification template
	let mainElement=document.getElementsByClassName("MCcOAc IqBfM EWZcud cjGgHb d8Etdd LcUz9d ecJEib")[0]
	let dataInputBox=document.createElement("div")
	mainElement.appendChild(dataInputBox)
	dataInputBox.classList="llhEMd iWO5td";
	dataInputBox.id="dataInputElement";
	//read cookie data
	let backupData=readCookie();
	//checking backup and ask user to import or not
	if(backupData!=null && document.getElementById("dataInputElement")){
		dataInputBox.innerHTML="<div class='mjANdc Nevtdc'> <div class='g3VIld iUQSvf vDc8Ic J9Nfi iWO5td' style='text-align:center;flex-direction:column;max-width: 400px;min-width:300px;'> <div class='XfpsVe J9fJmf' style='flex-direction: column;padding: 5px;'> <p align='center'><p style='font-size: 20px;font-weight: 400;margin;margin: 10px;'>Backup found.Do you want to import?</p> <span>( Press No to start fresh session )</span></p> <input id='input1' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' autofocus='true' value='Subject name:"+backupData[0]+"' disabled> <input id='input2' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' value='Section name:"+backupData[1]+"' disabled></div> <div class='XfpsVe J9fJmf' style='flex-direction:row;justify-content: center;'> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='no' style='background-color: rgb(0, 121, 107);'><span class='RveJvd snByac' style='color: white;padding: 10px;'>No</span></div> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='yes' style='background-color: rgb(0, 121, 107);margin-left: 30px;'><span class='RveJvd snByac' style='justify-content: center;color: white;padding: 10px;'>Yes</span></div> </div> </div> </div>"
		document.getElementById("no").onclick=()=>{
		dataInputBox.innerHTML=  "<div class='mjANdc Nevtdc'> <div class='g3VIld iUQSvf vDc8Ic J9Nfi iWO5td' style='text-align:center;flex-direction:column;max-width: 400px;min-width:300px;'> <div class='XfpsVe J9fJmf' style='padding: 5px;'> <p align='center'> <p style='font-size: 20px;font-weight: 400;margin: 0px;'>Enter data</p> <br><span>( leave empty if not applicable )</span> <input id='input1' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' autofocus='true' placeholder='Enter subject name'> <input id='input2' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' placeholder='Enter section name'></div> <div class='XfpsVe J9fJmf' style='flex-direction:row;justify-content: center;'> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='cancel' style='background-color: rgb(0, 121, 107);'><span class='RveJvd snByac' style='color: white;padding: 10px;'>Cancel</span></div> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='submit' style='background-color: rgb(0, 121, 107);margin-left: 30px;'><span class='RveJvd snByac' style='justify-content: center;color: white;padding: 10px;'>Submit</span></div> </div> </div> </div>"
			document.getElementById("cancel").onclick=()=>{performAction("Calcel");}
			document.getElementById("submit").onclick=()=>{performAction("Submit");}
		}
		document.getElementById("yes").onclick=()=>{
			subjectName=backupData[0];
			sectionName=backupData[1];
			backupData[2].forEach((name,index)=>{
				let personIndex=person_details[0].indexOf(name);
				if(personIndex==-1){
					person_details[0].push(name)
					person_details[1].push(parseFloat(backupData[3][index]))
					person_details[2].push(0)
					person_details[3].push(0)
				}
				else{
					person_details[1][personIndex]+=parseFloat(backupData[3][index]);
				}
			})
			performAction("Calcel");
		}
	}
	else{
		dataInputBox.innerHTML=  "<div class='mjANdc Nevtdc'> <div class='g3VIld iUQSvf vDc8Ic J9Nfi iWO5td' style='text-align:center;max-width: 400px;min-width:300px;flex-direction: column;'> <div class='XfpsVe J9fJmf' style='flex-direction: column;padding: 5px;'> <p align='center'> <p style='font-size: 20px;font-weight: 400;margin: 0px;'>Enter data</p> <br><span>( leave empty if not applicable )</span> <input id='input1' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' autofocus='true' placeholder='Enter subject name'> <input id='input2' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' placeholder='Enter section name'></div> <div class='XfpsVe J9fJmf' style='flex-direction:row;justify-content: center;'> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='cancel' style='background-color: rgb(0, 121, 107);'><span class='RveJvd snByac' style='color: white;padding: 10px;'>Cancel</span></div> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='submit' style='background-color: rgb(0, 121, 107);margin-left: 30px;'><span class='RveJvd snByac' style='justify-content: center;color: white;padding: 10px;'>Submit</span></div> </div> </div> </div>"
		document.getElementById("cancel").onclick=()=>{performAction("Calcel");}
		document.getElementById("submit").onclick=()=>{performAction("Submit");}
	}
	let endBtn=document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ tWDL4c jh0Tpd Gt6sbf QQrMi ftJPW");
	if(endBtn.length==1 && endBtn[0].attributes["aria-label"].value=="Leave call"){
		let controller=endBtn[0].attributes["jscontroller"].value;
		endBtn[0].attributes["jscontroller"].value="";
		function removeBehavaviour(){
			initiateDownload();
   	 		alert("Click ok/close tab after file download");
   	 		endBtn[0].removeEventListener("click",removeBehavaviour);
   	 		endBtn[0].attributes["jscontroller"].value=controller;
		}
		endBtn[0].addEventListener("click",removeBehavaviour);
   	}
   	else{
   		if(!window.Notification)
		{
			alert("You have to download attendance by clicking Download button");
		}
		else
		{
			if(Notification.permission!='granted'){
				Notification.requestPermission()
			}
			else if(Notification.permission=='granted')
			{
				let testNotify=new Notification("You have to download attendance by clicking Download button");
				setTimeout(()=>{testNotify.close()},4000)
			}
		}
   	}
}
let pageIniInterval=setInterval(openSideBar,10000+Math.random()*5000);
