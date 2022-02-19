"use strict";
const path = require("path");
const FileHelper = require("./file-helper");
const Parameters = require("./parameters").get();
const WalletType = require("./wallet-type");

const objectToCsv = require("csv-writer").createObjectCsvWriter;

module.exports.exportBalances = async (symbol, balances, format) => {
  const withType = await WalletType.addType(balances);

  const writeCsv = () => {
    const file = Parameters.outputFileNameCSV.replace(/{token}/g, symbol);
    FileHelper.ensureDirectory(path.dirname(file));

    //CSV출력시에도 Token Id를 포함하는 경우
    /*
    const writer = objectToCsv({
      path: file,
      header: [{ id: "wallet", title: "Wallet" }, { id: "amount", title: "Amount" }, { id: "tokenIds", title: "TokenIds" }, { id: "type", title: "Type" }]
    });
    */

    const writer = objectToCsv({
      path: file,
      header: [{ id: "wallet", title: "Wallet" }, { id: "amount", title: "Amount" }, { id: "type", title: "Type" }]
    });

    console.log("Exporting CSV");
    writer.writeRecords(withType).then(() => console.log("CSV export done!"));
  };

  if (["csv", "both"].indexOf(format.toLowerCase()) > -1) {
    writeCsv();

    if (format.toLowerCase() === "csv") {
      return;
    }
  }

  console.log("Exporting JSON");
  await FileHelper.writeFile(Parameters.outputFileNameJSON.replace(/{token}/g, symbol), withType);
  console.log("JSON export done!");
};
