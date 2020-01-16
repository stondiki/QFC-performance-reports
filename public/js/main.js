M.AutoInit();

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
                }, 1000);
            } else {
                M.toast({html: 'An error occured while logging you out.', classes: 'orange darken-1'});
            }
        });
    });
});