const modal = document.getElementById('modal');
const open = document.getElementById('open');
const close = document.getElementsByClassName('main__modal-close')[0];


open.onclick = function() {
    modal.style.display = "block";
    document.body.classList.add("modal-open"); 
}


close.onclick = function() {
    modal.style.display = "none";
    document.body.classList.remove("modal-open"); 
}

modal.onclick = function(event) {
    if (event.target === modal) {
        close.onclick();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('phone');

    input.addEventListener('input', () => {
        let value = input.value.replace(/\D/g, '');

        
        let formattedValue = '+7 (';
        if (value.length > 1) {
            formattedValue += value.slice(1, 4); 
        }
        if (value.length >= 4) {
            formattedValue += ') ' + value.slice(4, 7); 
        }
        if (value.length >= 7) {
            formattedValue += '-' + value.slice(7, 9); 
        }
        if (value.length >= 9) {
            formattedValue += '-' + value.slice(9, 11); 
        }
        input.value = formattedValue; 
    });
});


const modal_burger = document.getElementById('modal_burger')
const open_burger = document.getElementById('open_burger');
const close_burger = document.getElementById('burger_close');


open_burger.onclick = function(){
    modal_burger.style.display = "block";
    open_burger.style.display = "hide";
}
close_burger.onclick = function() {
    modal_burger.style.display = "none";   
    open_burger.style.display = "show";
}
modal_burger.onclick = function(event) {
    if (event.target === modal_burger) {
        close_burger.onclick();
    }
}

document.querySelector('.main__modal-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        firtsName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phoneNumber: formData.get('phoneNumber'),
        E_mail: formData.get('email'),
        Message: formData.get('message')
    };

    fetch('https://672b185d976a834dd02595f5.mockapi.io/contactForm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Данные отправлены');
        let DateSent = document.getElementById('formSend');
        DateSent.classList.add('main__send-show')
        document.querySelector('.main__modal-form').reset()
        
        setTimeout(() => {
            DateSent.classList.remove('main__send-show')
        }, 3000)
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});



