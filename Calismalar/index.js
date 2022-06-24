
const loading = document.querySelector("#loading");
const loadUserButton = document.querySelector("#loadUsers");
const ul = document.querySelector("#ul-1")


//POSTLAR


document.querySelector("#loadPost").addEventListener("click", () => {
    ul.innerHTML = "";
    userDOM.innerHTML = "";
    setTimeout(() => {

        loading.setAttribute("style", "display:flex; justify-content:center;")

        setTimeout(() => {
            fetch('https://jsonplaceholder.typicode.com/posts').then(response => {
                return response.json();
            }).then(response => {
                loading.setAttribute("style", "display:none");
                const posts = response.slice(0, 20)
                renderPost(posts)
            });
        }, 2000);
    }, 500); // 2000 olarak ayarla
})





const renderPost = (data = []) => {
    ul.innerHTML = "";
    data.forEach((item) => {
        const li = document.createElement("li");
        ul.classList.add('block');
        userDOM.classList.add('hidden');
        ul.classList.remove('none');
        userDOM.classList.remove('block');

        li.innerHTML = `<div class="card">
      <div class="card-body">
        ${item.title}
      </div>
    </div>`
        ul.appendChild(li)
    })

}


// #####################################################################################################################    


//KULLANICILAR

//fetch
let users = [];

const loadUsers = () => {
    ul.innerHTML = "";
    userDOM.innerHTML = "";
    setTimeout(() => {
        loading.setAttribute("style", "display:flex; justify-content:center")

        setTimeout(() => {
            fetch('https://jsonplaceholder.typicode.com/users').then(response => {
                return response.json();
            }).then(response => {
                loading.setAttribute("style", "display:none");
                users = response.map((x, index) => {
                    x.orderNo = index + 1;
                    return x;
                });
                renderUsers(users);
            }).catch(err => alert("Bir Hata oluştu"))

        }, 2000); // 2000 olarak ayarla

    }, 500);
}


loadUserButton.addEventListener("click", loadUsers);

//table


const userDOM = document.querySelector("#user");


//renderUsers
let user = {};

const renderUsers = (users = []) => {

    userDOM.innerHTML = "";
    ul.classList.add('hidden');
    userDOM.classList.add('block');
    ul.classList.remove('block');
    userDOM.classList.remove('none');


    const table = document.createElement("table");
    table.classList.add("table");

    const thead = document.createElement("thead");

    //burası statik, değişmiyor
    thead.innerHTML = `
        <tr>
            <th class="thId " scope="col">İd</th>
            <th class="thIndex " scope="col">Sıra No</th>
            <th class="thName "  scope="col">Name</th>
            <th class="thEmail " scope="col">Email</th>
            <th class="thPhone " scope="col">Phone</th>
            <th class="thWebsite " scope="col">Website</th>
            <th id="Act"  scope="col">Actions</th>
        </tr>
    `
    table.appendChild(thead);
    userDOM.appendChild(table);

    const tbody = document.createElement("tbody");

    tbody.innerHTML = users.map((user, index) => {

        return `
        <tr>
            <td class="id"  scope="row">${user.id}</td>
            <td class="index" scope="row">${index + 1}</td>
            <td class="name">${user.name}</td>
            <td class="email">${user.email}</td>
            <td class="phone">${user.phone}</td>
            <td class="website">${user.website}</td>
            <td>
            <button type="button" class="btn btn-danger btn-sm remove" data-id="${user.id}">Sil</button>
            <button type="button" class="btn btn-warning btn-sm update" data-id="${user.id}">Düzenle</button>
            </td>
           
        </tr>
        `

    }).join(" ");


    //map array döndüğü için join ile string hala getirdik

    table.appendChild(tbody);

    userDOM.appendChild(table);







    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", function () {
            const status = confirm(" Kaydı silmek silmek üzeresiniz. ");
            if (status) {
                const id = this.getAttribute("data-id");
                renderUsers(users.filter(x => x.id != id)) //remove işlemi burada oluyor
            }
        });
    });

    document.querySelectorAll(".update").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const _user = users.find(user => user.id == id)

            fillUser(_user);
            toggleUser();
            toggleTable("none");


        })
    })

    const toggleTable = (display = "none") => {
        document.querySelector("#user").style.display = display;
    }


    const toggleUser = (display = "block") => {
        document.querySelector("#user-form").style.display = display;
    }




    const fillUser = (user) => {
        document.querySelector("#labelName").value = user.name;
        document.querySelector("#labelEmail").value = user.email;
        document.querySelector("#labelPhone").value = user.phone;
        document.querySelector("#labelWebsite").value = user.website;
        document.querySelector("#userId").value = user.id;
    }

    const updateUser = () => {
        try {
            const name = document.querySelector("#labelName").value;
            const email = document.querySelector("#labelEmail").value;
            const phone = document.querySelector("#labelPhone").value;
            const webSite = document.querySelector("#labelWebsite").value;
            const userId = document.querySelector("#userId").value;

            const index = users.findIndex(user => user.id == userId)

            fetch("http://localhost:3000/update")
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                })

            users[index] = { name, phone, website: webSite, email, id: userId };

            renderUsers(users);
            toggleTable("block");
            toggleUser("none")
        } catch (err) {
            alert("Bir Hata oluştu");
            toggleTable("block");
            toggleUser("none");
        }
    }


    document.querySelector("#cancel").addEventListener("click", () => {
        toggleTable("block");
        toggleUser("none")
    })

    document.querySelector("#save").addEventListener("click", updateUser);


    // ##########################
    //   TABLO SIRALAMA
    //   https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript/49041392?answertab=trending#tab-top
    // ##########################


    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    // do the work...
    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        const tbody = table.querySelector('tbody');
        Array.from(tbody.querySelectorAll('tr'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => tbody.appendChild(tr));
    })));



}