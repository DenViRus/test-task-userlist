window.onload = () => {
  const mainTable = document
    .querySelector(".main-table")
    .querySelector("tbody");

  const getNewRow = function (picture, name) {
    const mainTableRow = document
      .querySelector(".item-template")
      .content.cloneNode(true);

    mainTableRow.querySelector(".item-user-picture").src = picture;
    mainTableRow.querySelector(".main-table-item-username").textContent = name;

    mainTable.appendChild(mainTableRow);
  };

  const xhrGet = new XMLHttpRequest();

  try {
    xhrGet.open(
      "GET",
      "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture",
      true
    );
    xhrGet.responseType = "json";
    xhrGet.send();
  } catch (e) {
    throw new Error(e);
  }

  let usersData = null;

  xhrGet.onload = () => {
    if (xhrGet.readyState === 4 && xhrGet.status === 200) {
      usersData = xhrGet.response.results;
      usersData.sort((a, b) => {
        if (a.name.last < b.name.last) {
          return -1;
        }
        if (a.name.last > b.name.last) {
          return 1;
        }
        return 0;
      });

      for (const user of usersData) {
        const userPic = user.picture.medium;
        const titleName = user.name.title;
        const firstName = user.name.first;
        const lastName = user.name.last;

        const userName = `${titleName[0].toUpperCase() + titleName.slice(1)}. ${
          firstName[0].toUpperCase() + firstName.slice(1)
        } ${lastName[0].toUpperCase() + lastName.slice(1)}`;
        getNewRow(userPic, userName);
      }

      let userRows = document.querySelectorAll(".main-table-row");

      //

      const selectOrder = document.querySelector(".order-select");

      selectOrder.addEventListener("change", (event) => {
        const { options, selectedIndex } = event.currentTarget;
        if (options[selectedIndex].text === "ordered") {
          userRows.forEach((item) => item.remove());

          usersData.sort((a, b) => {
            if (a.name.last < b.name.last) {
              return -1;
            }
            if (a.name.last > b.name.last) {
              return 1;
            }
            return 0;
          });
          for (const user of usersData) {
            const userPic = user.picture.medium;
            const titleName = user.name.title;
            const firstName = user.name.first;
            const lastName = user.name.last;

            const userName = `${
              titleName[0].toUpperCase() + titleName.slice(1)
            }. ${firstName[0].toUpperCase() + firstName.slice(1)} ${
              lastName[0].toUpperCase() + lastName.slice(1)
            }`;
            getNewRow(userPic, userName);
          }
          userRows = document.querySelectorAll(".main-table-row");
          getPopup();
        } else if (options[selectedIndex].text === "revers") {
          userRows.forEach((item) => item.remove());
          usersData.reverse();
          for (const user of usersData) {
            const userPic = user.picture.medium;
            const titleName = user.name.title;
            const firstName = user.name.first;
            const lastName = user.name.last;

            const userName = `${
              titleName[0].toUpperCase() + titleName.slice(1)
            }. ${firstName[0].toUpperCase() + firstName.slice(1)} ${
              lastName[0].toUpperCase() + lastName.slice(1)
            }`;
            getNewRow(userPic, userName);
          }
          userRows = document.querySelectorAll(".main-table-row");
          getPopup();
        }
      });

      const getPopup = function () {
        for (let i = 0, len = userRows.length; i < len; i++) {
          userRows[i].addEventListener("click", (event) => {
            const popup = document.querySelector(".popup");
            popup.className = "popup";
            popup.querySelector(".popup-user-picture").src =
              usersData[i].picture.large;
            popup.querySelector(".popup-header").textContent = userRows[
              i
            ].querySelector(".main-table-item-username").textContent;
            popup.querySelector(
              ".popup-data-street"
            ).textContent = `Street: ${usersData[i].location.street.replace(
              /(^|\s)([a-z])/g,
              (g0, g1) => g0.toUpperCase()
            )}`;
            popup.querySelector(
              ".popup-data-city"
            ).textContent = `City: ${usersData[i].location.city.replace(
              /(^|\s)([a-z])/g,
              (g0, g1) => g0.toUpperCase()
            )}`;
            popup.querySelector(
              ".popup-data-state"
            ).textContent = `State: ${usersData[i].location.state.replace(
              /(^|\s)([a-z])/g,
              (g0, g1) => g0.toUpperCase()
            )}`;
            popup.querySelector(
              ".popup-data-email"
            ).textContent = `Email: ${usersData[i].email}`;
            popup.querySelector(
              ".popup-data-phone"
            ).textContent = `Phone: ${usersData[i].phone}`;
          });
        }
      };

      getPopup();

      document
        .querySelector(".popup-close")
        .addEventListener("click", (event) => {
          event.preventDefault();
          document.querySelector(".popup").className += " hidden";
        });

      document.querySelector(".preloader").remove();
    }
  };
};
