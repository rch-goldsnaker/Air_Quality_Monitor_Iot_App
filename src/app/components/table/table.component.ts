import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { max } from 'rxjs';
import { MasterService } from 'src/app/services/master.service';
import { __asyncDelegator } from 'tslib';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{

  //slider

  temperatureSlider={
    disabled : true,
    max : 100,
    min : 0,
    showTicks : false,
    step : 1,
    thumbLabel : true,
    value : 0
  }

  pm25Slider={
    disabled : true,
    max : 250,
    min : 0,
    showTicks : false,
    step : 1,
    thumbLabel : true,
    value : 0
  }

  pressureSlider={
    disabled : true,
    max : 100,
    min : 0,
    showTicks : false,
    step : 1,
    thumbLabel : true,
    value : 0
  }


  aqiSlider={
    disabled : true,
    max : 300,
    min : 0,
    showTicks : false,
    step : 1,
    thumbLabel : true,
    value : 0
  }

  // Color Scale PM2.5 AQI

  sensorRangePM25=[
    {
      label:'Good',
      min:0,
      max:12
    },
    {
      label:'Moderate',
      min:12.1,
      max:35.4
    },
    {
      label:'Unhealthy for Sensitive Groups',
      min:35.5,
      max:55.4
    },
    {
      label:'Unhealthy',
      min:55.5,
      max:150.4
    },
    {
      label:'Very Unhealthy',
      min:150.5,
      max:250.4
    },
    {
      label:'Hazardous',
      min:250.5,
      max:"+"
    }
  ]

  sensorRangeAQI=[
      {
        label:'Good',
        min:0,
        max:50
      },
      {
        label:'Moderate',
        min:51,
        max:100
      },
      {
        label:'Unhealthy for Sensitive Groups',
        min:101,
        max:150
      },
      {
        label:'Unhealthy',
        min:151,
        max:200
      },
      {
        label:'Very Unhealthy',
        min:201,
        max:300
      },
      {
        label:'Hazardous',
        min:301,
        max:"+"
      }
  ]

  //table

  displayedColumns = ['deviceName','deviceTypeSensor','deviceSensorValue'];
  dataSource!:MatTableDataSource<any>;
  result: any[] = [];
  devices: any[] = [];
  rangeDescriptionPM: any;
  rangeColorPM:any;
  rangeTooltipPM:any;
  rangeDescriptionAqi: any;
  rangeColorAqi:any;
  rangeTooltipAqi:any;
  loading=false;

  @ViewChild('paginator') paginator! : MatPaginator;
  @ViewChild(MatSort) matSort! : MatSort;

  constructor(private service: MasterService,private _snackBar: MatSnackBar,public dialog: MatDialog) {}

  ngOnInit() {

    this.getDataSource()
    this.getData("EastPoint-UIG-007-Purple")
  }

  getData(devName:any){
    this.service.getData().subscribe((response:any) =>{
      this.result = response.map((res:any)=>({
        deviceName: res.datasource.name,
        deviceId: res.datasource.entityAliasId,
        deviceTypeSensor: res.dataKey.name,
        deviceSensorValue: Math.round(res.dataKey._hash*100),
        deviceSensorUnits: res.dataKey.name === "temperature"? "°F" : res.dataKey.name === "pressure"? "atm" : res.dataKey.name === "pm2.5_a"? "PM 2.5":"AQI"
      })).filter((device:any)=>{
        if(device.deviceName === devName){
          return true
        }else{
          return false
        }
      })

      this.dataSource = new MatTableDataSource(this.result);
      this.temperatureSlider.value = this.result[0].deviceSensorValue
      this.pm25Slider.value = this.result[1].deviceSensorValue
      this.pressureSlider.value = this.result[2].deviceSensorValue
      this.aqiSlider.value = this.result[3].deviceSensorValue

      this.getRangePM()
      this.getRangeAqi()


    })
  }
  getDataSource(){
    this.service.getDataSources().subscribe(result=>{
      this.devices = result.map((res)=>{
        return { value: res.name ,viewValue : res.name}
      })
    })
  }

  onChange($event: any){
    this.fakeLoading()
    this.getData($event.value)
    this.openSnackBar($event.value)
  }

  getRangePM(){

    if(this.result[1].deviceSensorValue<12){
        return this.rangeDescriptionPM = "Good",this.rangeColorPM ="#a9d163",this.rangeTooltipPM ="Air quality is satisfactory and poses little or no risk."
      }else if(this.result[1].deviceSensorValue<35.4){
        return this.rangeDescriptionPM = "Moderate",this.rangeColorPM ="#f7d358",this.rangeTooltipPM ="Sensitive individuals should avoid outdoor activity as they may experience respiratory symptoms."
      }else if(this.result[1].deviceSensorValue<55.4){
        return this.rangeDescriptionPM = "Unhealthy for Sensitive Groups",this.rangeColorPM ="#fb9855",this.rangeTooltipPM ="General public and sensitive individuals in particular are at risk to experience irritation and respiratory problems."
      }else if(this.result[1].deviceSensorValue<150.4){
        return this.rangeDescriptionPM = "Unhealthy",this.rangeColorPM ="#f4686b",this.rangeTooltipPM ="Increased likelihood of adverse effects and aggravation to the heart and lungs among general public."
      }else if(this.result[1].deviceSensorValue<250.4){
        return this.rangeDescriptionPM = "Very Unhealthy",this.rangeColorPM ="#a57db9",this.rangeTooltipPM ="General public will be noticeably affected. Sensitive groups should restrict outdoor activities."
      }else{
        return this.rangeDescriptionPM = "Hazardous",this.rangeColorPM ="#9f7684",this.rangeTooltipPM ="General public at high risk of experiencing strong irritations and adverse health effects. Should avoid outdoor activities."
      }
  }

  getRangeAqi(){
    if(this.result[3].deviceSensorValue<50){
        return this.rangeDescriptionAqi = "Good",this.rangeColorAqi ="#a9d163",this.rangeTooltipAqi ="Air quality is satisfactory and poses little or no risk."
      }else if(this.result[3].deviceSensorValue<100){
        return this.rangeDescriptionAqi = "Moderate",this.rangeColorAqi ="#f7d358",this.rangeTooltipAqi ="Sensitive individuals should avoid outdoor activity as they may experience respiratory symptoms."
      }else if(this.result[3].deviceSensorValue<150){
        return this.rangeDescriptionAqi = "Unhealthy for Sensitive Groups",this.rangeColorAqi ="#fb9855",this.rangeTooltipAqi ="General public and sensitive individuals in particular are at risk to experience irritation and respiratory problems."
      }else if(this.result[3].deviceSensorValue<200){
        return this.rangeDescriptionAqi = "Unhealthy",this.rangeColorAqi ="#f4686b",this.rangeTooltipAqi ="Increased likelihood of adverse effects and aggravation to the heart and lungs among general public."
      }else if(this.result[3].deviceSensorValue<300){
        return this.rangeDescriptionAqi = "Very Unhealthy",this.rangeColorAqi ="#a57db9",this.rangeTooltipAqi ="General public will be noticeably affected. Sensitive groups should restrict outdoor activities."
      }else{
        return this.rangeDescriptionAqi = "Hazardous",this.rangeColorAqi ="#9f7684",this.rangeTooltipAqi ="General public at high risk of experiencing strong irritations and adverse health effects. Should avoid outdoor activities."
      }
  }

  openSnackBar(msg:any){
    this._snackBar.open("Connecting to ["+ msg+"]...📡", '', {
      duration: 1500,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass:['customClass']
    });
  }

  openDialog() {
    this.dialog.open(DialogInfoComponent);
  }

  fakeLoading(){
    this.loading=true;
    setTimeout(() => {
      this.loading=false
    }, 1000);
  }
}
