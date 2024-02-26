const PizzaResponse = sessionStorage.getItem("pizzaCounters");
const bookingResponse= sessionStorage.getItem("bookingResponse");
const totalCartResponse = sessionStorage.getItem("cartTotal");
const pizzaCountResponse = sessionStorage.getItem("pizzaCount");
const parsedBookingResponse= JSON.parse(bookingResponse);
const parsedPizzaResponse = JSON.parse(PizzaResponse);
const parsedCartTotal= JSON.parse(totalCartResponse);
const parsedPizzaCount = JSON.parse(pizzaCountResponse);
const temp = Object.values(parsedPizzaResponse);
console.log(parsedBookingResponse);
console.log(parsedPizzaResponse);
var count=1;

const progressBar= document.getElementById("progress-bar-length");
progressBar.style.width = `${count * 25}%`;

function loadReceiptData(){
    document.getElementById("username-span").innerHTML = `${parsedBookingResponse.name}`;

    // Loop through the pizzaArray and create table rows
    var pizzaDataArray = Object.values(parsedPizzaResponse);
    document.getElementById("receipt-cards").innerHTML ="";

    document.getElementById("receipt-cards").innerHTML +=
            `<div class="sq align-self-center "> <img class="img-fluid  my-auto align-self-center mr-2 mr-md-4 pl-0 p-0 m-0" src="https://images.creativemarket.com/0.1.0/ps/133476/1360/906/m1/fpnw/wm1/dq4oqyfyekc1sdhjd3o6jdqklbv6asxrjxqy17yyzlqd1ron3xaidzeweftj5l1w-.jpg?1403596776&s=45c6ff9cebcc5e651229352706f57104" width="135" height="135" /> </div>
                <div class="media-body my-auto text-right">
                    <div class="row  my-auto flex-column flex-md-row">`


    var newHTML = ''

            for(let i=0;i<temp.length;i++){
                if(temp[i] != 0){
                    newHTML += `<div style="width: max-content; margin-right:74px; " > ${pizzaArray[i].name} x${temp[i]}</div>`
                }
            }

             document.getElementById("receipt-cards").innerHTML +=`<div class="col my-auto"> <h6 class="mb-0"> ${newHTML} </h6>  </div>  <div class="col my-auto"><h6 class="mb-0">&#8377;${parsedCartTotal}</h6></div>
                    </div>
                </div>
            </div>`
    // for (var i = 0; i < pizzaDataArray.length; i++) {
    //     var pizzaData = pizzaDataArray[i];

    //     if (pizzaData !== 0) {
    //         const { rowHTML, pizzaTotal } = pizzaTableItem(i, pizzaData);
    //         document.getElementById("receipt-cards").innerHTML += rowHTML;
    //     }
    // };
}

function pizzaTableItem(i, quantity) {
    // Calculate the total for each pizza
    const pizzaTotal = pizzaArray[i].price * quantity;

    // Return both the table row HTML and the calculated total
    return {
        rowHTML: `<div class="sq align-self-center "> <img class="img-fluid  my-auto align-self-center mr-2 mr-md-4 pl-0 p-0 m-0" src="${pizzaArray[i].image}" width="135" height="135" /> </div>
                    <div class="media-body my-auto text-right">
                        <div class="row  my-auto flex-column flex-md-row">
                            <div class="col my-auto"> <h6 class="mb-0"> Your Orders </h6>  </div>
                            // <div class="col-auto my-auto"> <small>${pizzaArray[i].price} </small></div>
                            <div class="col my-auto"> <small>Qty : ${parsedPizzaCount}</small></div>
                            <div class="col my-auto"><h6 class="mb-0">&#8377;${parsedCartTotal}</h6>
                            </div>
                        </div>
                    </div>
                </div>`
    };
}


loadReceiptData();

async function handleStartTask(){
    const ovenResponseData= await ovenResponse();
    console.log(ovenResponseData);
        if(!ovenResponseData)
        {
                const startTask_url = new URL("http://localhost:8080/users/startTasks");
                const startTask_params = new URLSearchParams();
                startTask_params.append("email", parsedBookingResponse.email);
            
                try {
                    const startResponse = await fetch(startTask_url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: startTask_params.toString()
                    });
            
                    // You may want to handle the response here
                    const responseData = await startResponse.json();
                    console.log(responseData);
                    if(responseData !== null)
                    {
                        let intervalId;
                        async function checkAllBaked(){
                            const allBaked_url = new URL("http://localhost:8080/users/ifAllBaked");
                            const allBaked_params = new URLSearchParams();
                            allBaked_params.append("email", parsedBookingResponse.email);

                            const bakedResponse = await fetch(allBaked_url, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                body: allBaked_params.toString()
                            });

                            const bakedResponseData = await bakedResponse.json();
                            if(bakedResponseData === true)
                            {
                                    clearInterval(intervalId);
                                    count++;
                                    progressBar.style.width = `${count * 25}%`;
                                    loadReceiptData();
                                
                                    function update(){

                                        count++;
                                        progressBar.style.width = `${count * 25}%`;
                                        loadReceiptData();
                                        console.log("Hit Here")
                                        setTimeout(eatingDone, 2000);
                                    };
                                    setTimeout(update, 45000);
                            }
                        }
                        intervalId= setInterval(checkAllBaked, 2000);
                    }
                    }catch (error) {
                    console.error('Error while fetching:', error);
                }
            }else if(ovenResponseData) {
                const ovenUrl = "../ovenWait/ovenWait.html";
                window.location.replace(ovenUrl);
            }
    }
    handleStartTask();

async function ovenResponse(){
    const ovenWait = await fetch("http://localhost:8080/users/ifOvensAvailable", {
        method: 'GET',
    })

    const ovenData = await ovenWait.json();
    return ovenData;

}

async function toggleThankYouPage(){
    const user_url = new URL("http://localhost:8080/users/saveUserUpdates");
    const user_params = new URLSearchParams();
    user_params.append("email", parsedBookingResponse.email);

        const userUpdated = await fetch(user_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: user_params.toString()
            });
    
        const userUpdatedData = await userUpdated.json();
        console.log(userUpdatedData);
        console.log(userUpdatedData.activeAcceptance)
        if (userUpdatedData.activeAcceptance === false) {
            const thankyouurl = "../thankyou/thankyou.html";
            window.location.replace(thankyouurl);
        }
}

function eatingDone(){
    count++;
    progressBar.style.width = `${count * 25}%`;
    loadReceiptData();
    setTimeout(toggleThankYouPage, 3000);
}