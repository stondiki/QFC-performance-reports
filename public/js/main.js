M.AutoInit();

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'left',
      hoverEnabled: false
    });
  });

// Functions for resgister page
if(window.location.pathname == '/register'){
    document.querySelector('#register-btn').addEventListener('click', () => {
        let form_values = {
            fname: document.querySelector('#fname').value,
            lname: document.querySelector('#lname').value,
            onames: document.querySelector('#onames').value,
            phone: document.querySelector('#phone').value,
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value,
            cpassword: document.querySelector('#cpassword').value,
        };
        if(form_values.fname != "" && form_values.lname != ""){
            if(form_values.phone != "" && form_values.email != ""){
                if(form_values.password != "" && form_values.cpassword != ""){
                    if(form_values.password == form_values.cpassword){
                        let url = '/register';
                        let options = {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify(form_values)
                          };
                          fetch(url, options)
                          .then(resp => resp.json())
                          .then(data => {
                              if(data.status == 'success'){
                                M.toast({html: data.message, classes: 'green darken-1'});
                                M.toast({html: 'You are being redirected to the login page.'});
                                setTimeout(() => {
                                    window.location.replace('/login');
                                }, 1000);
                              } else {
                                M.toast({html: data.message, classes: 'orange darken-1'});
                              }
                          });
                    } else {
                        document.querySelector('#password').value = "";
                        document.querySelector('#cpassword').value = "";
                        document.querySelector('#password').focus();
                        M.toast({html: 'The passwords do not match.', classes: 'orange darken-1'});
                    }
                } else {
                    if(form_values.password == ""){
                        document.querySelector('#password').focus();
                        M.toast({html: 'Password is required.', classes: 'orange darken-1'});
                    } else if(form_values.cpassword == ""){
                        document.querySelector('#cpassword').focus();
                        M.toast({html: 'You need to confirm your password.', classes: 'orange darken-1'});
                    }
                }
            } else {
                if(form_values.phone == ""){
                    document.querySelector('#phone').focus();
                    M.toast({html: 'Phone number is required.', classes: 'orange darken-1'});
                } else if(form_values.email == ""){
                    document.querySelector('#email').focus();
                    M.toast({html: 'Email is required.', classes: 'orange darken-1'});
                }
            }
        } else {
            if(form_values.fname == ""){
                document.querySelector('#fname').focus();
                M.toast({html: 'First name is required.', classes: 'orange darken-1'});
            } else if(form_values.lname == ""){
                document.querySelector('#lname').focus();
                M.toast({html: 'Last name is required.', classes: 'orange darken-1'});
            }
        }
    });
}

// Functions for login page
if(window.location.pathname == '/login'){
    document.querySelector('#login-btn').addEventListener('click', () => {
        let form_values = {
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value
        };
        if(form_values.email != ""){
            if(form_values.password != ""){
                let url = '/login';
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form_values)
                };
                fetch(url, options)
                .then(resp => resp.json())
                .then(data => {
                    if(data.status == 'success'){
                        M.toast({html: data.message, classes: 'green darken-1'});
                        M.toast({html: 'You are being redirected to the home page.'});
                        setTimeout(() => {
                            window.location.replace('/');
                        }, 1000);
                      } else {
                        M.toast({html: data.message, classes: 'orange darken-1'});
                      }
                });
            } else {
                M.toast({html: 'Password is required.', classes: 'orange darken-1'});
                document.querySelector('#password').focus();
            }
        } else {
            M.toast({html: 'Email is required.', classes: 'orange darken-1'});
            document.querySelector('#email').focus();
        }
    });
}

// logout function
document.querySelectorAll('.logout-btn').forEach(element => {
    element.addEventListener('click', () => {
        fetch('/logout')
        .then(resp => resp.json())
        .then(data => {
            if(data.status == 'success'){
                M.toast({html: data.message, classes: 'green darken-1'});
                M.toast({html: 'You are being redirected to the home page.'});
                setTimeout(() => {
                    window.location.replace('/');
                }, 500);
            } else {
                M.toast({html: 'An error occured while logging you out.', classes: 'orange darken-1'});
            }
        });
    });
});

// Function for stocks page
if(window.location.pathname == "/stocks"){
        fetch('/stocks/get')
        .then(resp => resp.json())
        .then(data => {
            if(data.status == 'success'){
                let tb = document.querySelector('#stocks-table-body');
                tb.innerHTML = '';
                data.data.forEach(element => {
                    tb.innerHTML += `
                        <tr>
                            <td><a href="#buy-modal" class="green-text modal-trigger" onclick="openBuyModal('`+element.symbol+`')"><i class="small material-icons">monetization_on</i></a> <a href="#sell-modal" class="red-text modal-trigger" onclick="openSellModal('`+element.symbol+`')"><i class="small material-icons">monetization_on</i></a></td>
                            <td><a href="#view-orders" class="modal-trigger" onclick="getOrders('`+element.symbol+`')"><i class="small material-icons black-text">receipt</i></a> <a href="#delete-stock" class="red-text modal-trigger"><i class="small material-icons">delete</i></a></td>
                            <td><b>`+element.symbol+`</b></td>
                            <td>Name</td>
                            <td>85.61</td>
                            <td>+1.36%</td>
                            <td>45000000</td>
                        </tr>
                    `;
                });
            }
        });

    document.querySelector('#add-symbol-btn').addEventListener('click', () => {
        let symbol = {symbol: document.querySelector('#symbol').value.toUpperCase()};
        if(symbol != ""){
            let url = '/stocks/add';
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(symbol)
            }
            fetch(url, options)
            .then(resp => resp.json())
            .then(data => {
                if(data.status == 'success'){
                    M.toast({html: 'Stock added successfully.', classes: 'green darken-1'});
                } else {
                    M.toast({html: 'An error occured while adding stock.', classes: 'orange darken-1'});
                }
            });
        }
    });

    function openBuyModal(symbol) {
        document.querySelector('#buy-symbol').innerHTML = symbol;
        document.querySelector('#buy-entry').value = "";
        document.querySelector('#buy-amount').value = "";
    }

    function openSellModal(symbol) {
        document.querySelector('#sell-symbol').innerHTML = symbol;
        document.querySelector('#sell-entry').value = "";
        document.querySelector('#sell-amount').value = "";
    }

    function getOrders(symbol) {
        let tbody = document.querySelector('#view-orders-modal-table');
        document.querySelector('#orders-title').innerHTML = symbol + ' orders';
        tbody.innerHTML = "";
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({symbol: symbol})
        }
        let url = '/stocks/orders';
        fetch(url, options)
        .then(resp => resp.json())
        .then(data => {
            if(data.data){
                data.data.reverse();
                console.log(data.data);
                data.data.forEach(element => {
                    if(element.status == 'working'){
                        tbody.innerHTML += `
                        <td><a href="#cancel-order" class="modal-trigger" onclick="openCancelOrder('`+symbol+`', '`+element.market+`', `+element.entry+`, `+element.amount+`, '`+element.orderType+`', '`+element.tradeType+`', '`+element.status+`', `+element.timestamp+`)"><i class="small red-text material-icons">remove_circle</i></a></td>
                        <td class="`+element.market+`">`+element.market.toUpperCase()+`</td>
                        <td>`+element.entry+`</td>
                        <td>`+element.amount+`</td>
                        <td>`+element.orderType.toUpperCase()+`</td>
                        <td>`+element.tradeType.toUpperCase()+`</td>
                        <td class="`+element.status+`">`+element.status.toUpperCase()+`</td>
                        <td>`+new Date(element.timestamp)+`</td>
                        `;
                    } else {
                        tbody.innerHTML += `
                        <td></td>
                        <td class="`+element.market+`">`+element.market.toUpperCase()+`</td>
                        <td>`+element.entry+`</td>
                        <td>`+element.amount+`</td>
                        <td>`+element.orderType.toUpperCase()+`</td>
                        <td>`+element.tradeType.toUpperCase()+`</td>
                        <td class="`+element.status+`">`+element.status.toUpperCase()+`</td>
                        <td>`+new Date(element.timestamp)+`</td>
                        `;
                    }
                });
            }
        });
    }

    let cData = {};
    function openCancelOrder(symbol, market, entry, amount, orderType, tradeType, status, timestamp){
        let tbody = document.querySelector('#cancel-order-table-body');
        tbody.innerHTML = `
            <td>`+market+`</td>
            <td>`+entry+`</td>
            <td>`+amount+`</td>
            <td>`+orderType+`</td>
            <td>`+tradeType+`</td>
            <td>`+status+`</td>
            <td>`+new Date(timestamp)+`</td>
        `;
        cData.symbol = symbol;
        cData.market = market;
        cData.entry = entry;
        cData.amount = amount;
        cData.orderType = orderType,
        cData.tradeType = tradeType,
        cData.status = status;
        cData.timestamp = timestamp;
    }

    function cancelOrder(){
        let options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cData)
        }
        let url = '/stocks/orders/delete';
        fetch(url, options)
        .then(resp => resp.json())
        .then(data => {
            if(data.status == 'success'){
                M.toast({html: data.message, classes: 'green darken-1'});
                M.Modal.getInstance(document.querySelector('#cancel-order')).close();
            } else {
                M.toast({html: data.message, classes: 'red darken-1'});
                M.Modal.getInstance(document.querySelector('#cancel-order')).close();
            }
        });
    }

    document.querySelector('#buy-order').addEventListener('change', () => {
        if(document.querySelector('#buy-order').value == 'market'){
            document.querySelector('#buy-entry').setAttribute('disabled', true);
        } else {
            document.querySelector('#buy-entry').removeAttribute('disabled');
        }
    });

    document.querySelector('#sell-order').addEventListener('change', () => {
        if(document.querySelector('#sell-order').value == 'market'){
            document.querySelector('#sell-entry').setAttribute('disabled', true);
        } else {
            document.querySelector('#sell-entry').removeAttribute('disabled');
        }
    });

    document.querySelector('#buy-symbol-btn').addEventListener('click', () => {
        let data = {
            market: 'buy',
            symbol: document.querySelector('#buy-symbol').innerHTML,
            entry: document.querySelector('#buy-entry').value,
            amount: document.querySelector('#buy-amount').value,
            order: document.querySelector('#buy-order').value,
            tradeType: document.querySelector('#buy-tradeTime').value
        };
        let url = '/stocks/orders/add';

        if(data.order != 'market'){
            if(data.entry != "" && data.amount != ""){
                
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                };
    
                fetch(url, options)
                .then(resp => resp.json())
                .then(data => {
                    if(data.status == 'success'){
                        M.toast({html: 'Order placed successfully.', classes: 'green darken-1'});
                        M.Modal.getInstance(document.querySelector('#buy-modal')).close();
                    } else {
                        M.toast({html: 'An error occurered while placing your order', classes: 'red darken-1'});
                    }
                });
            } else {
                if(data.entry == ""){
                    M.toast({html: 'You need to give an entry point', classes: 'orange darken-1'});
                } else if(data.amount == ""){
                    M.toast({html: 'You need to give an amount', classes: 'orange darken-1'});
                }
            }
        } else {
            if(data.amount != ""){
                data.entry = 0;
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                };
    
                fetch(url, options)
                .then(resp => resp.json())
                .then(data => {
                    if(data.status == 'success'){
                        M.toast({html: 'Order placed successfully.', classes: 'green darken-1'});
                        M.Modal.getInstance(document.querySelector('#buy-modal')).close();
                    } else {
                        M.toast({html: 'An error occurered while placing your order', classes: 'red darken-1'});
                    }
                });
            } else {
                M.toast({html: 'You need to give an amount', classes: 'orange darken-1'});
            }
        }
    });

    document.querySelector('#sell-symbol-btn').addEventListener('click', () => {
        let data = {
            market: 'sell',
            symbol: document.querySelector('#sell-symbol').innerHTML,
            entry: document.querySelector('#sell-entry').value * 1,
            amount: document.querySelector('#sell-amount').value * (-1),
            order: document.querySelector('#sell-order').value,
            tradeType: document.querySelector('#sell-tradeTime').value
        };
        let url = '/stocks/orders/add';

        if(data.order != 'market'){
            if(data.entry == ""){
                M.toast({html: 'You need to give an entry', classes: 'orange darken-1'});
            } else if(data.amount ==""){
                M.toast({html: 'You need to give an amount', classes: 'orange darken-1'});
            } else {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                };
                
                fetch(url, options)
                .then(resp => resp.json())
                .then(data => {
                    if(data.status == 'success'){
                        M.toast({html: 'Order placed successfully.', classes: 'green darken-1'});
                        M.Modal.getInstance(document.querySelector('#sell-modal')).close();
                    } else {
                        M.toast({html: 'An error occurered while placing your order', classes: 'red darken-1'});
                    }
                });
            }
        } else {
            if(data.amount == ""){
                M.toast({html: 'You need to give an amount', classes: 'orange darken-1'});
            } else {
                data.entry = 0;
                let options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                };
                
                fetch(url, options)
                .then(resp => resp.json())
                .then(data => {
                    if(data.status == 'success'){
                        M.toast({html: 'Order placed successfully.', classes: 'green darken-1'});
                        M.Modal.getInstance(document.querySelector('#sell-modal')).close();
                    } else {
                        M.toast({html: 'An error occurered while placing your order', classes: 'red darken-1'});
                    }
                });
            }
        }
    });
}

// Functions for events page
if(window.location.pathname == '/events'){
    fetch('events/get')
    .then(resp => resp.json())
    .then(data => {
        console.log(data);
        let eventsDis = document.querySelector('#events-dis');
        eventsDis.innerHTML = "";
        data.data.forEach(event => {
            let dt = new Date(event.date+' '+event.time);
            if(event.entry == 0){
                event.entry = 'Free';
            } else {
                event.entry = 'Kshs. '+event.entry;
            }
            if(data.role == 'admin'){
                eventsDis.innerHTML += `
                <div class="col s12">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                            <span class="card-title"><h5>`+event.title+`</h5></span>
                            <br>
                            Description:
                            <h6>`+event.description+`</h6>
                            <br>
                            <h6>Venue: <span><b>`+event.venue+`</b></span></h6>
                            <h6>Date: <b>`+dt.toDateString()+`</b></h6>
                            <h6>Time: <b>`+event.time.slice(0,5)+`</b></h6>
                            <h6>Entry: <span><b>`+event.entry+`</b></span></h6>
                            </div>
                            <div class="card-action">
                            <a href="#">Register</a>
                            <a href="#">Edit</a>
                            <a href="#">Delete</a>
                        </div>
                    </div>
                </div>
            `;
            } else {
                eventsDis.innerHTML += `
                <div class="col s12">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                            <span class="card-title"><h5>`+event.title+`</h5></span>
                            <br>
                            Description:
                            <h6>`+event.description+`</h6>
                            <br>
                            <h6>Venue: <span><b>`+event.venue+`</b></span></h6>
                            <h6>Date: <b>`+dt.toDateString()+`</b></h6>
                            <h6>Time: <b>`+event.time.slice(0,5)+`</b></h6>
                            <h6>Entry: <span><b>`+event.entry+`</b></span></h6>
                            </div>
                            <div class="card-action">
                            <a href="#">Register</a>
                        </div>
                    </div>
                </div>
            `;
            }
        });
    });

    document.querySelector('#add-event-btn').addEventListener('click', () => {
        let formFields = {
            title: document.querySelector('#title').value,
            description: document.querySelector('#description').value,
            date: document.querySelector('#date').value,
            time: document.querySelector('#time').value,
            venue: document.querySelector('#venue').value,
            entry: document.querySelector('#entry').value
        };
        console.log(formFields);
        if(formFields.title == ''){
            document.querySelector('#title').focus();
            M.toast({html: 'Title is requires', classes: 'red darken-1'});
        } else {
            if(formFields.description == ''){
                document.querySelector('#description').focus();
                M.toast({html: 'Description is requires', classes: 'red darken-1'});
            } else {
                if(formFields.date == '') {
                    document.querySelector('#date').focus();
                    M.toast({html: 'Date is requires', classes: 'red darken-1'});
                } else {
                    if(formFields.time == ''){
                        document.querySelector('#time').focus();
                        M.toast({html: 'Time is requires', classes: 'red darken-1'});
                    } else {
                        if(formFields.venue == ''){
                            document.querySelector('#venue').focus();
                            M.toast({html: 'Title is requires', classes: 'red darken-1'});
                        } else {
                            if(formFields.entry == ''){
                                document.querySelector('#entry').focus();
                                M.toast({html: 'Entry is requires', classes: 'red darken-1'});
                            } else {
                                let url = '/events/add';
                                let options = {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(formFields)
                                };

                                fetch(url, options)
                                .then(resp => resp.json())
                                .then(data => {
                                    console.log(data);
                                });
                            }
                        }
                    }
                }
            }
        }
    });
}