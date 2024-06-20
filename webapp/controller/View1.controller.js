sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("task.controller.View1", {
            onInit: function () {
                var oModel = new JSONModel();
                oModel.loadData("../model/data.json");
                this.getView().setModel(oModel);
            },
            
            onDownloadPDF: function () {
                // Get the table controls
                var oTable0 = this.byId("table0");
                var oTable1 = this.byId("table1");
                var oTable2 = this.byId("table2");
            
                // Get the binding contexts of the tables
                var oBinding0 = oTable0.getBinding("rows");
                var oBinding1 = oTable1.getBinding("rows");
                var oBinding2 = oTable2.getBinding("rows");
            
                // Get the data from the binding contexts
                var aTable0Data = oBinding0.getModel().getProperty(oBinding0.getPath());
                var aTable1Data = oBinding1.getModel().getProperty(oBinding1.getPath());
                var aTable2Data = oBinding2.getModel().getProperty(oBinding2.getPath());
            
                // Define the PDF content
                var docDefinition = {
                    pageSize: 'A4',
                    pageOrientation: 'portrait',
                    content: [
                        { text: 'PPA Q1 FY 24', style: 'header' },
                        this._buildTable0(aTable0Data),  // Use ProductCollection from your model data
                        { text: ' ', margin: [0, 10] },  // Add space between tables
                        this._buildTable(aTable1Data, 'Volume for Earning-Durashine', ["Jan'24", "Feb'24", "Mar'24"], ["CC", "SS", "CC", "SS", "CC", "SS"]),
                        { text: ' ', margin: [0, 10] },  // Add space between tables
                        this._buildTable(aTable2Data, 'Volume for Earning-Infinia', ["Jan'24", "Feb'24", "Mar'24"], ["CC", "Bare", "CC", "Bare", "CC", "Bare"])
                    ],
                    styles: {
                        header: {
                            fontSize: 12,
                            bold: true,
                            margin: [0, 0, 0, 10]
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 8,  // Reduce font size for table headers
                            color: 'black',
                            alignment: 'center',
                            fillColor: '#D3D3D3'
                        },
                        tableData: {
                            fontSize: 8,
                            alignment: 'center'  // Center align table data
                        }
                    }
                };
            
                // Generate and download the PDF
                pdfMake.createPdf(docDefinition).download('sign-off.pdf');
            },
            
            _buildTable0: function (data) {
                var body = [];
            
                // Add table headers
                body.push([
                    { text: "", style: 'tableHeader' },
                    { text: "", style: 'tableHeader' },
                    { text: "Expense", style: 'tableHeader' },
                    { text: "Earning", style: 'tableHeader' },
                    { text: "TBSL to Pay (with GST)", style: 'tableHeader' },
                    { text: "Earning Left (Durashine)", style: 'tableHeader' },
                    { text: "Earning Left (Infinia)", style: 'tableHeader' },
                    { text: "Remark", style: 'tableHeader' }
                ]);
            
                // Add table data
                data.forEach(function (row) {
                    body.push([
                        { text: row.col1 || '', style: 'tableData' },
                        { text: row.col2 || '', style: 'tableData' },
                        { text: row.expense || '', style: 'tableData' },
                        { text: row.earning || '', style: 'tableData' },
                        { text: row.tbsl || '', style: 'tableData' },
                        { text: row.earningLeftDurashine || '', style: 'tableData' },
                        { text: row.earningLeftInfinia || '', style: 'tableData' },
                        { text: row.remark || '', style: 'tableData' }
                    ]);
                });
            
                return {
                    table: {
                        headerRows: 1,
                        widths: Array(8).fill('*'), // Ensure all columns have equal width
                        body: body
                    }
                };
            },
            
            _buildTable: function (data, title, months, columns) {
                var body = [];
            
                // Add table title
                body.push([{ text: title, colSpan: columns.length, alignment: 'center', style: 'tableHeader' }, ...Array(columns.length - 1).fill({})]);
            
                // Add table headers
                var headers = [];
                months.forEach(function (month, index) {
                    var colSpan = columns.length / months.length;
                    headers.push({ text: month, style: 'tableHeader', colSpan: colSpan, alignment: 'center' });
                    for (var i = 1; i < colSpan; i++) {
                        headers.push({});
                    }
                });
                body.push(headers);
            
                var subHeaders = columns.map(function (column) {
                    return { text: column, style: 'tableHeader', alignment: 'center' };
                });
                body.push(subHeaders);
            
                // Add table data
                data.forEach(function (row) {
                    var rowData = columns.map(function (column) {
                        return { text: row[column.toLowerCase()] || '', style: 'tableData' };
                    });
                    body.push(rowData);
                });
            
                return {
                    table: {
                        headerRows: 2,
                        widths: Array(columns.length).fill('*'), // Ensure all columns have equal width
                        body: body
                    }
                };
            }            
        });
    });
