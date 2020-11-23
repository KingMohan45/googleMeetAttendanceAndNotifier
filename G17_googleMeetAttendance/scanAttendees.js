var person_details=Array(4),subjectName,sectionName,aNodes,rNodes;
for(let i=0;i<4;i++){
	person_details[i]=Array();
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
	if(unusual!=null){
    		subjectName=unusual+"_"+subjectName;
    		unusual="";
  	}
	let csvFile = "Name,Total_time\n";
    for (let i = 0; i < person_details[0].length; i++) {
    	var tMin=person_details[1][i]+(person_details[2][i]==0?0:(Date.now()-person_details[2][i]))/60000
        csvFile += person_details[0][i]+","+Math.floor(tMin)+":"+Math.floor(((tMin*100)%100)*0.6)+"min\n";
    }
    date=new Date();
	downloadData(subjectName+"_"+sectionName+"_attendees_list@"+date.getHours()+"\:"+date.getMinutes()+"_"+date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear()+".csv",csvFile)
	if(unusual!=null){
    		subjectName=subjectName.substring(subjectName.indexOf('_')+1);
    		unusual="";
  	}
}
function showButtons()
{
	document.querySelector(".CYZUZd").innerHTML="<div tabindex='-1' class='J8vCN' id='start_stop' style='background: rgb(202, 9, 9);padding: 8px;color: white;border-radius: 20px;margin: 10px;cursor: pointer;text-align: center;font-size:16px;' >Start recording</div><div tabindex='-1' class='J8vCN' id='downloadFile' style='background: rgb(6, 91, 19);padding: 8px;color: white;border-radius: 20px;margin: 10px;cursor: pointer;text-align: center;font-size:16px;'>Download data</div>"
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
var parentSelection=setInterval(function selectParentClass()
{
	document.querySelector(".uArJ5e.UQuaGc.kCyAyd.QU4Gid.foXzLb.IeuGXd").click()//open box
	document.querySelector(".f0WtFf").insertBefore(document.querySelector(".uD3s5c"),document.querySelector(".f0WtFf").childNodes[0])//insert element
	document.querySelector(".mKBhCf.qwU8Me.RlceJe.kjZr4").attributes["jsaction"].value="rcuQ6b:npT2md;z1yzAc:rcuQ6b;transitionend:qQ3yIc; mousedown:mLt3mc;BvOpG:uXqkWb"//prevent close
	document.querySelector(".rG0ybd").attributes["jsaction"].value="GvneHb:zhP1M;TpIHXe:xGg34c;L3AHvb:IUt7Tc;L6tSXb:B6c1Fe;z1yzAc:dw5tqf;c8DrJb:IcHsd"//prevent bottom row minimize
	showButtons();
	var parentClass=document.getElementsByClassName("GvcuGe"),parentElement;
	var n=parentClass.length;
	for(var i=0;i<n;i++){
		if(parentClass[i].attributes["aria-label"] && parentClass[i].attributes["aria-label"].value=="Participants"){
			parentElement=parentClass[i];
		}
	}
	if(parentElement==null){
		alert("Something wrong, feel free to contact to resolve the issue. Take attendance manually for now.")
		return;
	}
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
	    	var name=inserted_node.children[0].textContent;/*
	    	if(isNormal){
				name=name.slice(name.indexOf('off')+3,name.indexOf("Joined"));
			}*/
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
	    	/*if(isNormal){
				name=name.slice(name.indexOf('off')+3,name.indexOf("Joined"));
			}*/
	    	var index=person_details[0].indexOf(name);
	    	if(!--person_details[3][index]){
	    		person_details[1][index]+=(Date.now()-person_details[2][index])/60000;
				person_details[2][index]=0;
	    	}
		})
	})
	parentElement.childNodes.forEach((element)=>{
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
				person_details[3][index]++;
			}
		}
	})
	document.getElementById('start_stop').click();
	peopleObserver.observe( parentElement, { childList:true})
	alert("Attendance scanning started you can click on download on top right corner to download data as CSV file.");
	subjectName=prompt("Enter subject name")
	if(subjectName==null){
		subjectName="subject";
	}
	sectionName=prompt("Enter section name")
	if(sectionName==null){
		sectionName="seciton";
	}
	if(!window.Notification)
	{
		alert("Your browser won't support desktop notifications");
	}
	else
	{
		if(Notification.permission!='granted'){
			alert("Allow notifications");
			Notification.requestPermission()
		}
		if(Notification.permission=='granted')
		{
			var testNotify=new Notification("Desktop notications enabled");
			setTimeout(()=>{testNotify.close()},4000)
			chatParentElement=document.querySelector(".z38b6.CnDs7d.hPqowe");
			var chatObserver=new MutationObserver(function(m){
				if(m.length==1 && m[0].addedNodes.length>0){
					//message=m[0].addedNodes[0]
					m[0].addedNodes.forEach((content)=>{
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
							var notify=new Notification(sectionName+"_"+name,{
					          body:message
					        })
				        	setTimeout(()=>{notify.close()},4000)
					    }
					})
				}
			})
			chatObserver.observe(chatParentElement,{childList:true,subtree:true})
		}
	}
	var handRaiseObserver=new MutationObserver((mutationRecord)=>{
		mutationRecord.forEach((mutation)=>{
	    	mutation.addedNodes.forEach((person)=>{
	      		var name=person.children[0].textContent;
		      	if(name.indexOf("(You)")==-1){
		        	var notify=new Notification(sectionName+"_"+name,{body:"RaisedHand"})
		        	setTimeout(()=>{notify.close()},4000)
			    }
		    })
		})
	})
	if(document.getElementsByClassName("GvcuGe")[0].attributes["aria-label"].textContent=="Raised hands"){
	  handRaiseObserver.observe(document.getElementsByClassName("GvcuGe")[0],{childList:true})
	}
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
		        			var notify=new Notification(sectionName+"_"+name,{body:"RaisedHand"})
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
	handRaiseBox.observe(document.getElementsByClassName("ggUFBf")[0].children[0],{childList:true})
	document.onkeydown=(e)=>{
	  if(e.keyCode==27){
			document.querySelector(".uArJ5e.UQuaGc.kCyAyd.QU4Gid.foXzLb.IeuGXd").click()
			showButtons()
			document.getElementById('start_stop').innerHTML="Stop recording";
		}
	}
	setInterval(()=>{
		var connCheck=document.getElementsByClassName("wyQwQb");
		if(connCheck.length==1){
			initiateDownload("Emergency");
			new Notification("It looks like you lost the connection, check once. For backup file downlad starred")
		}
		else{
			connCheck.children.forEach((element)=>{
				if(element.attributes["role"]=="status"){
					initiateDownload("Emergency");
					new Notification("It looks like you lost the connection, check once. For backup file downlad starred")
				}
			})
		}
	},4000)
	setTimeout(()=>{
		initiateDownload("Backup");
		var notify=new Notification("50min completed. Backup attendance download initiated.")
		setTimeout(()=>{notify.close()},4800)
	},3000000)
	clearInterval(parentSelection);
},10000);  
