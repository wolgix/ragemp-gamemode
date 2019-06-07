/**
 * ---CLIENT---
 */
const browser = require("./createBrowser");
const remoteFunctions = require("./remoteFunctions");

mp.events.add(
	{
		"bridgeBroswerToClient": (payload) => {
		// Fired when a message comes from the broser to the client
		
			const dest = JSON.parse(payload).to;
			if(dest === "server"){
				invokeServer(payload);
			}else{
				handleInvoke(payload);
			}
		},
		"bridgeServerToClient": payload => {
			// Fires when the server send a message to the client
			mp.gui.chat.push(typeof payload);

			const info = JSON.parse(payload);
			if(info.to === "browser"){
				invokeBrowser(payload);
			}else{
				handleInvoke(info);
			}
			
		}
	});

function handleInvoke(info){
	
	if(typeof remoteFunctions[info.function] === "function"){
		remoteFunctions[info.function](...info.parameter);
	}else{
		// Function not found
	}

}

function invokeBrowser(payload){
	browser.execute(`bridge.invoke(${payload})`);
}

function invokeServer(payload){
	mp.events.callRemote("bridgeClientToServer",payload);
}

exports = {
	browser:{
		emit(event,payload){
			// TODO
		},
		on(event,callback){
			// TODO
		}
	},
	server(nameOfFunction,...parameter){
		invokeServer({
			to:"server",
			function:nameOfFunction,
			parameter
		});
	}
};