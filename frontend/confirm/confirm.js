    // Retrieve the response data from localStorage
    const bookingResponse = sessionStorage.getItem('bookingResponse');
    const parsedResponse = JSON.parse(bookingResponse);
    const userActiveAcceptance = parsedResponse.activeAcceptance;


    async function ovenResponse(){
        const ovenWait = await fetch("http://localhost:8080/users/ifOvensAvailable", {
            method: 'GET',
      })

      const ovenData = await ovenWait.json();
      return ovenData;

    }
    async function checkOvenStatus() {
        try {
            const ovenStats = await ovenResponse();
            console.log(ovenStats);
    
            const lobbyUrl = "../pizzaWait/pizzaWait.html";
            const queueUrl = "../queue/queue.html";
            const ovenUrl = "../ovenWait/ovenWait.html";
    
            // Use the ovenStats and userActiveAcceptance to determine the next URL
            // Replace the following conditions with your logic
            if (userActiveAcceptance === true && ovenStats === false) {
                window.location.replace(lobbyUrl);
            } else if (userActiveAcceptance === true && ovenStats === true) {
                window.location.replace(ovenUrl);
            } else {
                window.location.replace(queueUrl);
            }
        } catch (error) {
            console.error("Error fetching oven data:", error);
        }
    }
    
    setTimeout(checkOvenStatus, 5000);