var person_details=Array(4),subjectName,sectionName,aNodes,rNodes,peopleParent;
let windowLocation=window.location.toString();
let meetingCode=windowLocation.substring(windowLocation.indexOf(".com/")+5,windowLocation.indexOf("?")==-1?windowLocation.length:windowLocation.indexOf("?"))
for(let i=0;i<4;i++){
	person_details[i]=Array();
}
var chatObserver=new MutationObserver(function(mutationRecord){
	mutationRecord.forEach((mutation)=>{
		if(mutation.addedNodes.length>0){
		//message=m[0].addedNodes[0]
			mutation.addedNodes.forEach((content)=>{
				var name,message=content.textContent;
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
					var notify=new Notification((sectionName?(sectionName+"_"):"")+name,{
			          body:message
			        })
		        	setTimeout(()=>{notify.close()},4000)
			    }
			})
		}
	})
})
var handRaiseObserver=new MutationObserver((mutationRecord)=>{
	mutationRecord.forEach((mutation)=>{
    	mutation.addedNodes.forEach((person)=>{
      		var name=person.children[0].textContent;
	      	if(name.indexOf("(You)")==-1){
	        	var notify=new Notification((sectionName?(sectionName+"_"):"")+name,{body:"RaisedHand"})
	        	setTimeout(()=>{notify.close()},4000)
		    }
	    })
	})
})
var handRaiseBox=new MutationObserver((mutationRecord)=>{
  	mutationRecord.forEach((mutation)=>{
		mutation.addedNodes.forEach((addedNode)=>{	
			if(addedNode.classList.contains("GvcuGe")){
				handRaiseObserver.observe(addedNode,{childList:true})
				if(addedNode.children.length>1){
					var notify=new Notification("Two or more people raised hands");
					setTimeout(()=>{notify.close()},4000)
				}
				else{
					var name=addedNode.children[0].children[0].textContent;
					if(name.indexOf("(You)")==-1){
	        			var notify=new Notification((sectionName?(sectionName+"_"):"")+name,{body:"RaisedHand"})
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
})
var peopleObserver = new MutationObserver(function(mutationRecord){
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
    	var name=inserted_node.children[0].textContent;
    	var index=person_details[0].indexOf(name);
    	if(index==-1){
    		person_details[0].push(name);
			person_details[1].push(0);
			if(document.getElementById('start_stop').innerText.startsWith('Stop')){
				person_details[2].push(Date.now())
			}
			else{
				person_details[2].push(0);
			}
			person_details[3].push(1);
    	}
    	else{
    		if(person_details[2][index]==0){
	    		if(document.getElementById('start_stop').innerText.startsWith('Stop')){
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
    	var name=deleted_node.children[0].textContent;
    	var index=person_details[0].indexOf(name);
    	if(!--person_details[3][index]){
    		if(person_details[2][index]!=0){
    			person_details[1][index]+=(Date.now()-person_details[2][index])/60000;
    		}
			person_details[2][index]=0;
    	}
	})
})
var emergencyObserver=new MutationObserver((mutationRecord)=>{
  	mutationRecord.forEach((mutation)=>{
    	mutation.addedNodes.forEach((addedNode)=>{
      		if(addedNode.classList.contains("TqTEJc")){
      			var notify=new Notification("Internet fluctuating.");
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
})
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
	if(document.getElementById('start_stop').innerText.startsWith('Stop')){
		person_details[0].forEach((dummy,index)=>{
			if(person_details[3][index]){
				person_details[2][index]=Date.now();
			}
		})
	}
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
function initiateDownload(unusual)
{
	if(unusual!=null && subjectName!=null){
    		subjectName=unusual+"_"+subjectName;
    		unusual="";
  	}
	let csvFile = "ID,Mail,Name,Total_time\n";
    for (let i = 0; i < person_details[0].length; i++) {
    	let tMin=person_details[1][i]+(person_details[2][i]==0?0:(Date.now()-person_details[2][i]))/60000
    	let name=person_details[0][i],charEncountered=false,noNums=6,id="",j;
    	for(j=1;j<name.length;j++){
    		let cCode=name.charCodeAt(j);
    		if(cCode>=48 && cCode<=57){
    			id+=name.charAt(j);
    			if(!--noNums){
    				break;
    			}
    		}
    		else if((cCode>=65 && cCode<=90) || (cCode>=97 && cCode<=122)){
    			charEncountered=true;
				break;
    		}
    	}
    	if(charEncountered){
        	csvFile += ",,"+name.trim()+","+Math.floor(tMin)+":"+Math.floor(((tMin*100)%100)*0.6)+"min\n";
    	}
    	else{
    		csvFile += "R"+id+",r"+id+"@rguktrkv.ac.in,"+name.substring(j+1).trim()+","+Math.floor(tMin)+":"+Math.floor(((tMin*100)%100)*0.6)+"min\n";
    	}
    }
    date=new Date();
	downloadData(date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+"_"+(subjectName?(subjectName+"_"):"")+(sectionName?(sectionName+"_"):"")+"attendance"+".csv",csvFile);
	if(unusual!=null && subjectName!=null){
    		subjectName=subjectName.substring(subjectName.indexOf('_')+1);
    		unusual="";
  	}
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
function initiatePage(showPopup)
{
	document.querySelector(".uArJ5e.UQuaGc.kCyAyd.QU4Gid.foXzLb.IeuGXd").click()//open box
	let sideBar=document.getElementsByClassName("mKBhCf qwU8Me RlceJe kjZr4")[0];
	sideBar.attributes["jsaction"].value=""//"rcuQ6b:npT2md;z1yzAc:rcuQ6b;transitionend:qQ3yIc; mousedown:mLt3mc;BvOpG:uXqkWb"//prevent close
	document.onkeydown=(e)=>{
		setTimeout(()=>{
		  	if(e.keyCode==27 && document.getElementsByClassName("rG0ybd")[0].offsetWidth==document.body.offsetWidth){
				sideBar.style.right="-"+sideBar.offsetWidth+"px";
			}
		},400);
	}
	setTimeout(()=>{
		document.getElementsByClassName("VUk8eb")[0].onclick=()=>{
			sideBar.style.right="-"+sideBar.offsetWidth+"px"
		}
	},500)
	document.getElementsByClassName("loWbp")[0].onclick=()=>{
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
	}
	
	//show buttons;
	if(document.getElementsByClassName("CYZUZd").length==1){
		let elementToClone=document.getElementsByClassName("CYZUZd")[0];
		let customButtons=elementToClone.cloneNode();
		elementToClone.parentElement.insertBefore(customButtons,elementToClone.nextElementSibling);
		customButtons.innerHTML="<div class='J8vCN' id='start_stop' >Start recording</div><div class='J8vCN' id='downloadFile'>Download data</div>";
		let customStyle=document.createElement("style");
		customStyle.textContent="#start_stop:hover,#downloadFile:hover{box-shadow: 0 1px 6px rgba(32,33,36,.28);border-color: rgba(223,225,229,0);}#downloadFile,#start_stop{color: white;border-radius: 20px;margin: 10px;cursor: pointer;text-align: center;font-size:16px;}#downloadFile{background: rgb(0, 121, 107);padding: 8px;}#start_stop{background: rgb(217, 48, 37);padding: 8px}"
		document.body.appendChild(customStyle);
		document.getElementById('start_stop').addEventListener("click",function(){
			if(this.innerText.startsWith('Start')){
				this.innerHTML="Stop recording";
				open_sessions();
			}
			else{
				this.innerHTML="Start recording";
				close_sessions();
			}
		})
		document.getElementById('downloadFile').addEventListener("click",function(){
			initiateDownload();
		})
	}
	//buttons end

	document.querySelector(".f0WtFf").insertBefore(document.querySelector(".uD3s5c"),document.querySelector(".f0WtFf").childNodes[0]);//change presentation button place

	//Notification compatibility check
	if(!window.Notification)
	{
		alert("Your browser won't support desktop notifications");
	}
	else
	{
		//chat messages observer
		let chatParentElement=document.querySelector(".z38b6.CnDs7d.hPqowe");
		if(chatParentElement!=null){
			chatObserver.observe(chatParentElement,{childList:true,subtree:true})
		}
		if(Notification.permission!='granted'){
			Notification.requestPermission()
		}
		else if(Notification.permission=='granted')
		{
			let testNotify=new Notification("Desktop notications enabled");
			setTimeout(()=>{testNotify.close()},4000)
		}
	}

	//hand-raise observer
	if(document.getElementsByClassName("GvcuGe")[0].attributes["aria-label"].textContent=="Raised hands"){
	  handRaiseObserver.observe(document.getElementsByClassName("GvcuGe")[0],{childList:true})
	}

	//hand-raise box observer for first/fresh(one) hand-raise
	handRaiseBox.observe(document.getElementsByClassName("ggUFBf")[0].children[0],{childList:true})

	//selecting people parent class and then select people parent
	let peopleParentClass=document.getElementsByClassName("GvcuGe"),peopleParent;
	for(let i=0;i<peopleParentClass.length;i++){
		if(peopleParentClass[i].attributes["aria-label"] && peopleParentClass[i].attributes["aria-label"].value=="Participants"){
			peopleParent=peopleParentClass[i];
			break;
		}
	}
	if(peopleParent==null){
		alert("Something wrong, feel free to contact to resolve the issue. Take attendance manually for now.")
		return;
	}
	peopleParent.childNodes.forEach((element)=>{
		if(element.attributes.role!=null){
			var name=element.childNodes[0].textContent;
			var index=person_details[0].indexOf(name);
			if(index==-1){
				person_details[0].push(name);
				person_details[1].push(0);
				if(document.getElementById('start_stop').innerText.startsWith('Stop')){
					person_details[2].push(Date.now())
				}
				else{
					person_details[2].push(0);
				}
				person_details[3].push(1);
			}
			else{
				if(document.getElementById('start_stop').innerText.startsWith('Stop')){
					person_details[2].push(Date.now())
				}
				person_details[3][index]++;
			}
		}
	})
	document.getElementById('start_stop').click();
	peopleObserver.observe( peopleParent, { childList:true})

	//emergency observer
	emergencyObserver.observe(document.getElementsByClassName("crqnQb")[0],{childList:true})

	if(!showPopup){
		return;
	}
	//notification template
	let mainElement=document.getElementsByClassName("MCcOAc IqBfM EWZcud cjGgHb d8Etdd LcUz9d ecJEib")[0]
	var dataInputBox=document.createElement("div")
	mainElement.appendChild(dataInputBox)
	dataInputBox.classList="llhEMd iWO5td";
	dataInputBox.id="dataInputElement";
	//read cookie data
	let backupData=readCookie();
	//checking backup and ask user to import or not
	if(backupData!=null && document.getElementById("dataInputElement")){
		dataInputBox.innerHTML="<div class='mjANdc Nevtdc'> <div class='g3VIld iUQSvf vDc8Ic J9Nfi iWO5td' style='max-width: 400px;min-width:300px;flex-direction: column;'> <div class='XfpsVe J9fJmf' style='flex-direction: column;padding: 5px;'> <p align='center'><p style='font-size: 20px;font-weight: 400;margin;margin: 10px;'>Backup found.Do you want to import?</p> <span>( Press No to start fresh session )</span></p> <input id='input1' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' autofocus='true' value='Subject name:"+backupData[0]+"' disabled> <input id='input2' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' value='Section name:"+backupData[1]+"' disabled></div> <div class='XfpsVe J9fJmf' style='padding: px;justify-content: center;'> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='no' style='background-color: rgb(0, 121, 107);'><span class='RveJvd snByac' style='color: white;padding: 10px;'>No</span></div> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='yes' style='background-color: rgb(0, 121, 107);margin-left: 30px;'><span class='RveJvd snByac' style='justify-content: center;color: white;padding: 10px;'>Yes</span></div> </div> </div> </div>"
		document.getElementById("no").onclick=()=>{
			dataInputBox.innerHTML=  "<div class='mjANdc Nevtdc'> <div class='g3VIld iUQSvf vDc8Ic J9Nfi iWO5td' style='max-width: 400px;min-width:300px;flex-direction: column;'> <div class='XfpsVe J9fJmf' style='flex-direction: column;padding: 5px;'> <p align='center'> <p style='font-size: 20px;font-weight: 400;margin: 0px;'>Enter data</p> <br><span>( leave empty if not applicable )</span> <input id='input1' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' autofocus='true' placeholder='Enter subject name'> <input id='input2' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' placeholder='Enter section name'></div> <div class='XfpsVe J9fJmf' style='padding: px;justify-content: center;'> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='calcel' style='background-color: rgb(0, 121, 107);'><span class='RveJvd snByac' style='color: white;padding: 10px;'>Cancel</span></div> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='submit' style='background-color: rgb(0, 121, 107);margin-left: 30px;'><span class='RveJvd snByac' style='justify-content: center;color: white;padding: 10px;'>Submit</span></div> </div> </div> </div>"
			document.getElementById("calcel").onclick=()=>{performAction("Calcel");}
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
		dataInputBox.innerHTML=  "<div class='mjANdc Nevtdc'> <div class='g3VIld iUQSvf vDc8Ic J9Nfi iWO5td' style='max-width: 400px;min-width:300px;flex-direction: column;'> <div class='XfpsVe J9fJmf' style='flex-direction: column;padding: 5px;'> <p align='center'> <p style='font-size: 20px;font-weight: 400;margin: 0px;'>Enter data</p> <br><span>( leave empty if not applicable )</span> <input id='input1' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' autofocus='true' placeholder='Enter subject name'> <input id='input2' style='border: 0;padding: 5px;text-align: center;height: 30px;border-bottom: 2px solid rgb(0, 121, 107);' placeholder='Enter section name'></div> <div class='XfpsVe J9fJmf' style='padding: px;justify-content: center;'> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='calcel' style='background-color: rgb(0, 121, 107);'><span class='RveJvd snByac' style='color: white;padding: 10px;'>Cancel</span></div> <div role='button' class='U26fgb O0WRkf oG5Srb C0oVfc kHssdc vSWmFe' aria-disabled='false' tabindex='0' id='submit' style='background-color: rgb(0, 121, 107);margin-left: 30px;'><span class='RveJvd snByac' style='justify-content: center;color: white;padding: 10px;'>Submit</span></div> </div> </div> </div>"
		document.getElementById("calcel").onclick=()=>{performAction("Calcel");}
		document.getElementById("submit").onclick=()=>{performAction("Submit");}
	}
	clearInterval(pageIniInterval);
}
var pageIniInterval=setInterval(()=>{initiatePage(true)},5000+Math.random()*10000)
