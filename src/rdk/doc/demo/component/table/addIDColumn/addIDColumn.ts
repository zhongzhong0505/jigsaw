import {Component} from "@angular/core";
import {TableData} from "../../../../../core/data/table-data";
import {AdditionalColumnDefine} from "../../../../../component/table/table-api";
import {TableHeadNum, TableCellNum} from "../../../../../component/table/table-renderer";



@Component({
  templateUrl: 'addIDColumn.html'
})
export class TableAddIDColumnDemoComponent {
    tableData: TableData;
    constructor() {
        this.tableData = new TableData(
            [
                [
                    "Tiger Nixon1",
                    "System Architect",
                    "$320,00",
                    "2011/04/25",
                    "Edinburgh",
                    "542"
                ],[
                "Tiger Nixon2",
                "System Arcfhitect",
                "$320,8000",
                "2011/04/25",
                "Edinburgh",
                "5421"
            ],
                [
                    "Garrett Winflters1",
                    "Accountant",
                    "$170,7",
                    "2011/07/25",
                    "Tokyo",
                    "8422"
                ],

                [
                    "Garrett Winslters1",
                    "Accountant",
                    "$170,7",
                    "2011/07/25",
                    "Tokyo",
                    "8422"
                ],
                [
                    "Tiger Nixon2",
                    "System Arcfhitect",
                    "$320,8000",
                    "2011/04/25",
                    "Edinburgh",
                    "5421"
                ],
                [
                    "Garrett Winflters1",
                    "Accountant",
                    "$170,7",
                    "2011/07/25",
                    "Tokyo",
                    "8422"
                ],
                [
                    "Tiger Nixon2",
                    "System Arcfhitect",
                    "$320,8000",
                    "2011/04/25",
                    "Edinburgh",
                    "5421"
                ]
            ],
            ["name", "position", "salary", "start_date", "office", "extn"],
            ["姓名", "职位", "薪资", "入职日期", "部门", "其他"]);

    }



    private _additionalColumns: AdditionalColumnDefine[] = [{
            pos : 0,
            header: {
                renderer: TableHeadNum,
            },
            cell: {
                renderer: TableCellNum
            }
        }]
}


