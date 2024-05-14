function main() {

    const DBName = "myDB";
    const objectsFileName = "objects.json";
    const objectStoreName = "mydb_table_1";
    var runFromLocal = false;

    const objectsFromVariable = [
        {
            "name": "Elton Blackburn",
            "phone": "1-313-246-2988",
            "email": "auctor@hotmail.couk"
        },
        {
            "name": "Nash Branch",
            "phone": "(231) 444-7786",
            "email": "enim@icloud.org"
        },
        {
            "name": "Andrew Weiss",
            "phone": "1-631-882-8846",
            "email": "magna.suspendisse.tristique@outlook.net"
        },
        {
            "name": "Hu Lamb",
            "phone": "(547) 203-1058",
            "email": "erat.in.consectetuer@icloud.net"
        },
        {
            "name": "Kenyon Rollins",
            "phone": "(187) 844-0272",
            "email": "dictum.mi.ac@aol.com"
        }
    ]

    writeDB();

    function writeDB() {

        checkDB();

        function checkDB() {
            const request = window.indexedDB.open(DBName, 1);
    
            request.onerror = () => {
                console.log(request.error.message);
            }

            request.onsuccess = () => {
                readDB();
            }
    
            request.onupgradeneeded = () => {
                const DB = request.result;
                DB.createObjectStore(objectStoreName, {autoIncrement: true});
                getObjectsFile();
            }
        }

        async function getObjectsFile() {
            try {
                const response = await fetch(objectsFileName);
                if (response.ok) {
                    const objectsFromFile = await response.json();
                    writeRecords(objectsFromFile);
                }
            } catch (error) {
                console.log(error);
                runFromLocal = true;
                writeRecords(objectsFromVariable);
            }
        }

        function writeRecords(objects) {
            const request = window.indexedDB.open(DBName, 1);

            request.onerror = () => {
                console.log(request.error.message);
            }
    
            request.onsuccess = () => {
                const DB = request.result;
                const transaction = DB.transaction(objectStoreName, "readwrite");
                const objectStore = transaction.objectStore(objectStoreName);
                objects.forEach((object) => {
                    objectStore.add(object);
                })
                if (!runFromLocal) {
                    readDB();
                }
            }
        }
    }

    function readDB() {
        const request = window.indexedDB.open(DBName, 1);

        request.onerror = () => {
            console.log(request.error.message);
        }

        request.onsuccess = () => {
            const DB = request.result;
            const transaction = DB.transaction(objectStoreName, "readonly");
            const objectStore = transaction.objectStore(objectStoreName);
            const getDBRecords = objectStore.getAll();
                
                getDBRecords.onerror = () => {
                    console.log(getDBRecords.error);
                }

                getDBRecords.onsuccess = () => {
                    if (getDBRecords.result.length != 0) {
                        createTable(getDBRecords.result);
                    }
                }
        }

        function createTable(records) {
            const tableRoot = document.querySelector("#table");
            const tableHeader = document.createElement("tr");
            const headers = Object.keys(records[0]);
            headers.forEach((header) => {
                var headerText = document.createTextNode(header);
                var headerCell = document.createElement("th");
                headerCell.appendChild(headerText);
                tableHeader.appendChild(headerCell);
            })
            tableRoot.appendChild(tableHeader);
            for (let i = 0; i < records.length; i++) {
                var tableRow = document.createElement("tr");
                for (let j = 0; j < Object.keys(records[0]).length; j++) {
                    var tableCell = document.createElement("td");
                    var cellContent = document.createTextNode(Object.values(Object.values(records[i]))[j]);
                    tableCell.appendChild(cellContent);
                    tableRow.appendChild(tableCell);
                }
                tableRoot.appendChild(tableRow);
            }
        }
    }
}

document.addEventListener("OnDOMContentLoaded", main());