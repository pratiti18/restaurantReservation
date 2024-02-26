var countPizza = 0;
let cartTotal = 0;
const bookingResponse = sessionStorage.getItem('bookingResponse');
const parsedResponse = JSON.parse(bookingResponse);
var pizzaCounters = {};

function incrementQuantity(elementID) {
    var quantityInput = document.getElementById(elementID);
    var pizzaIndex = parseInt(elementID.match(/\d+$/)[0], 10);
    countPizza++;
    if (parseInt(quantityInput.value, 10) < 3) {
        quantityInput.value = parseInt(quantityInput.value, 10) + 1;
        updatePizzaCounter(pizzaIndex, 1);
        console.log(pizzaCounters);
    }
}

function decrementQuantity(elementID) {
    var quantityInput = document.getElementById(elementID);
    var pizzaIndex = parseInt(elementID.match(/\d+$/)[0], 10);
    countPizza--;
    if (parseInt(quantityInput.value, 10) > 0) {
        quantityInput.value = parseInt(quantityInput.value, 10) - 1;
        updatePizzaCounter(pizzaIndex, -1);
        console.log(pizzaCounters);
    }
}

function updatePizzaCounter(index, change) {
    if (!pizzaCounters.hasOwnProperty(index)) {
        pizzaCounters[index] = 0;
    }

    pizzaCounters[index] += change;
}

function addToCart() {
     console.log(countPizza);
     const orderBtn= document.getElementById("order-btn");
     orderBtn.disabled = false;
     if(countPizza === 0)
     {
        console.log("Entered 0");
        orderBtn.disabled = true;
        const totalElement = document.querySelector('.price.text-success');
        totalElement.innerHTML = "";
        document.getElementById("table-container").innerHTML = `<tr> 
            <td style="    width: 100%;
            margin-left: 150px;
            display: flex;
            align-items: center;">
                🍕 Oh no! It looks like your pizza cart is on a diet! How about sprinkling some pizza magic into it before you take a peek? 
            </td>
            </tr> `
        return;
     }

    // Ensure that pizzaCounters is an object before using Object.values
    const allPizzaIndexes = [1, 2, 3, 4]; // Assuming you have pizzas with indexes 1, 2, 3, 4
    allPizzaIndexes.forEach(index => {
            if (!pizzaCounters.hasOwnProperty(index)) {
                pizzaCounters[index] = 0;
            }
        });

            sessionStorage.setItem('pizzaCounters', JSON.stringify(pizzaCounters));
            sessionStorage.setItem('pizzaCount', countPizza);
            // Assuming you have pizzaArray and pizzaCounters already defined
            const PizzaResponse = sessionStorage.getItem("pizzaCounters");
            const parsedPizzaResponse = JSON.parse(PizzaResponse);
            console.log(parsedPizzaResponse);

            // Reset the cartTotal before recalculating
            cartTotal = 0;

            // Get the table container
            document.getElementById("table-container").innerHTML = '';

            // Loop through the pizzaArray and create table rows
            var pizzaDataArray = Object.values(parsedPizzaResponse);
            for (var i = 0; i < pizzaDataArray.length; i++) {
                var pizzaData = pizzaDataArray[i];

                if (pizzaData !== 0) {
                    const { rowHTML, pizzaTotal } = pizzaTableItem(i, pizzaData);
                    document.getElementById("table-container").innerHTML += rowHTML;
                    // Do not update cartTotal here.
                }
            };

            // Calculate the total only after populating the table
            cartTotal = pizzaDataArray.reduce((total, pizzaData, i) => {
                return total + (pizzaData !== 0 ? pizzaArray[i].price * pizzaData : 0);
            }, 0);

            // Update the displayed total in your HTML
            updateCartTotal();

            // Open the modal once the data is populated
            $('#cartModal').modal('show');
        }

function pizzaTableItem(i, quantity) {
    // Calculate the total for each pizza
    const pizzaTotal = pizzaArray[i].price * quantity;

    // Return both the table row HTML and the calculated total
    return {
        rowHTML: `<tr>
            <td class="w-25">
                <img src="${pizzaArray[i].image}" class="img-fluid img-thumbnail" alt="Sheep">
            </td>
            <td>${pizzaArray[i].name}</td>
            <td>${pizzaArray[i].price}</td>
            <td class="qty"><input type="text" class="form-control quantity" id="input1" value="${quantity}" disabled></td>
            <td>&#8377;${pizzaTotal}</td>
            <td>
                <a href="#" class="btn btn-danger btn-sm">
                    <span>Pending</span>
                </a>
            </td>
        </tr>`,
        pizzaTotal: pizzaTotal
    };
}

function updateCartTotal() {
    // Update the displayed total in your HTML
    const totalElement = document.querySelector('.price.text-success');
    totalElement.textContent = `₹${cartTotal}`;
    sessionStorage.setItem("cartTotal", JSON.stringify(cartTotal));
}

async function handleCheckOut(){
    const pizzaString = Object.values(pizzaCounters).join(',');
    console.log(pizzaString);
    const order_url = new URL("http://localhost:8080/users/orderNow");
    const order_params = new URLSearchParams();
    order_params.append("email", parsedResponse.email);
    order_params.append("quantity", countPizza);
    order_params.append("pizzaCounters", pizzaString);

    try {
        const pizzaResponse = await fetch(order_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: order_params.toString()
        });

        // You may want to handle the response here
        const responseData = await pizzaResponse.json();
        console.log(responseData);
        sessionStorage.setItem("bookingResponse", JSON.stringify(responseData));

        if(responseData.activeAcceptance === true){
            const pizzaReceiptUrl= "../pizzaReceipt/pizzaReceipt.html";
            window.location.replace(pizzaReceiptUrl);
        }
        else{
            const queueUrl= "../queue/queue.html";
            window.location.replace(queueUrl);
        }
   
    }catch (error) {
        console.error('Error while fetching:', error);
    }
}