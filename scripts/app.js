class App {
  createAndAppend(
    { className, parentElement, value, tagName } = {
      className,
      parentElement,
      value,
      tagName: "div"
    }
  ) {
    const element = document.createElement(tagName);
    element.className = className;
    value ? (element.innerHTML = value) : null;
    parentElement && parentElement.appendChild(element);

    return element;
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static gameFieldToString (field) {
    const strRows = [],
          arrayField = [];

    for(let i = 0; i < field.length; i++){
      let arrayRowField = [];
      for(let j = 0; j < field[i].length; j++){
        arrayRowField.push([field[i][j]._value]);
      }
      arrayField.push(arrayRowField);
    }      
    for(let i = 0; i < arrayField.length; i++){
        strRows.push(arrayField[i].join('&'));
    }

    const strField = strRows.join('||');
    return strField;
  }
  gameFieldToArray (string) {
    const backField = [];
    if(string !== ""){
      const strRows = string.split('||');

      for(let i = 0; i < strRows.length; i++){
          let arrRow = strRows[i].split('&');
          let test = [];

          for(let j = 0; j < arrRow.length; j++){
              let cellValue = +arrRow[j];
              test.push([cellValue]);
          }
          backField.push(test);
      }

      return backField;
    } else {
      return false;
    }
    
  }
  findItemInLocalStorage (searchKey){
    for(let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) {
        continue;
      }
      if(key === searchKey){
          return localStorage.getItem(searchKey);
      }
    }
    return false;
  }
}
