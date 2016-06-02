import {Component} from "@angular/core";

import {WeighIn} from "../../dao/weigh-in/WeighIn";
import {WeighInDao} from "../../dao/weigh-in/WeighInDao";

declare let Chart:any;

@Component({
    template: `
    <ion-navbar *navbar primary>
        <ion-title>Progress Chart</ion-title>
    </ion-navbar>
    <ion-content id="chartContainer">
        <ion-list>
            <ion-item>
                <ion-label>Target</ion-label>
                <ion-select [(ngModel)]="target" (ngModelChange)="loadDataAndRenderGraph()">
                    <ion-option value=".5">.5 LBS/Week</ion-option>
                    <ion-option value="1">1 LBS/Week</ion-option>
                    <ion-option value="1.5">1.5 LBS/Week</ion-option>
                    <ion-option value="2">2 LBS/Week</ion-option>
                    <ion-option value="2.5">2.5 LBS/Week</ion-option>
                    <ion-option value="3">3 LBS/Week</ion-option>
                </ion-select>
            </ion-item>
        </ion-list>
        <canvas id="canvas"></canvas>
    </ion-content>
    `
})
export class ProgressView {
    private target:string;

    constructor(private weighInDao:WeighInDao){
        this.weighInDao = weighInDao;
    }

    ionViewDidEnter(){
        this.initializeData();
        setTimeout(() => {
            this.resizeCanvas();
            this.loadDataAndRenderGraph();
        }, 300);
    }

    loadDataAndRenderGraph():void{
        this.loadData().then(data => {
            return this.processData(data)
        }).then(resultsObj => {
            this.renderCanvas(resultsObj.labels, resultsObj.dataSets);
        }).catch(error => {
           alert(`Failed to load data and render canvas - ${error.message}`);
        });
    }

    initializeData():void{
        this.target = "2";
    }

    resizeCanvas(){
        let container = document.getElementById("chartContainer");
        let listHeight = (<HTMLElement> (<HTMLElement> container.children[0]).children[0]).offsetHeight;
        let canvas = this.getCanvasElement();
        canvas.height = container.offsetHeight - listHeight - 50;
        canvas.width = container.offsetWidth;
    }

    getCanvasElement():HTMLCanvasElement{
        return <HTMLCanvasElement> document.getElementById("canvas");
    }

    renderCanvas(labels:string[], datasets:any[]):void{
        let canvas:HTMLCanvasElement = this.getCanvasElement();
        let context:CanvasRenderingContext2D = canvas.getContext("2d");
        let data = {
            labels: labels,
            datasets: datasets
        };
        let myLineChart = new Chart(context).Line(data, {});
    }

    loadData():Promise<WeighIn[]>{
        return this.weighInDao.getAll();
    }

    processData(weighIns:WeighIn[]){
        let map:Map<string, WeighIn[]> = this.getWeighInByDateMap(weighIns);
        let averagedMap:Map<string, number> = this.getAverageWeightForDay(map);
        let labels = this.getLabels(averagedMap);
        let realWorldDataSet = this.getRealWorldDataSet(averagedMap);
        let trendDataSet = this.getTrendDataSet(averagedMap);
        let idealDataSet = this.getIdealDataSet(averagedMap);
        return {
            labels:labels,
            dataSets: [realWorldDataSet, trendDataSet, idealDataSet]
        };
    }

    getLabels(map:Map<string, number>):string[]{
        let results:string[] = [];
        map.forEach(function(value:number, key:string, map:Map<string, number>){
            results.push(key);
        });
        return results;
    }

    getRealWorldDataSet(map:Map<string, number>):any{
        let dataPoints:number[] = [];
         map.forEach(function(value:number, key:string, map:Map<string, number>){
            dataPoints.push(value);
        });
        return {
            label: "Actual Results",
            fillColor: "rgba(247,70,74,0.0)",
            strokeColor: "rgba(247,70,74,1)",
            pointColor: "rgba(247,70,74,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(247,70,74,1)",
            data: dataPoints
        };
    }

    getTrendDataSet(map:Map<string, number>):any{
        let numberOfDataPoints:number = map.size;
        let minimumValue:number = -1;
        let maximumValue:number = -1;
        map.forEach(function(value:number, key:string, map:Map<string, number>){
            if ( minimumValue === -1 ){
                minimumValue = value;
            }
            if ( maximumValue === -1 ){
                maximumValue = value;
            }
            minimumValue = Math.min(minimumValue, value);
            maximumValue = Math.max(maximumValue, value);
        });
        let difference:number = maximumValue - minimumValue;
        let differencePerDataPoint:number = difference/numberOfDataPoints;
        let dataPoints:number[] = [];
        for ( let i = 0 ; i < numberOfDataPoints; i++ ){
            let averagedValueForPoint:number = maximumValue - (i * differencePerDataPoint);
            dataPoints.push(averagedValueForPoint);
        }
        return {
            label: "Trend Results",
            fillColor: "rgba(151,187,205,0.0)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: dataPoints
        }
    }

    getIdealDataSet(map:Map<string, number>):any{
        let numberOfDataPoints:number = map.size;
        let averageLossPerWeek:number = parseFloat(this.target);
        let averageLossPerDay:number = averageLossPerWeek/7;
        let maximumValue = -1;
        map.forEach(function(value:number, key:string, map:Map<string, number>){
            if ( maximumValue === -1 ){
                maximumValue = value;
            }
            maximumValue = Math.max(maximumValue, value);
        });
        let dataPoints:number[] = [];
        for ( let i = 0; i < numberOfDataPoints; i++ ){
            let idealWeight = maximumValue - (i * averageLossPerDay);
            dataPoints.push(idealWeight);
        }
        return {
            label: "Ideal Results",
            fillColor: "rgba(152,152,152,0.0)",
            strokeColor: "rgba(152,152,152,.5)",
            pointColor: "rgba(152,152,152,.5)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(152,152,152,.5)",
            data: dataPoints
        }
    }

    getWeighInByDateMap(weighIns:WeighIn[]):Map<string, WeighIn[]>{
        let map:Map<string, WeighIn[]> = new Map<string, WeighIn[]>();
        weighIns.forEach(weighIn => {
           let dateString = this.getDateStringFromDate(weighIn.created);
           let list = map.get(dateString);
           if ( ! list ){
               list = [];
           }
           list.push(weighIn);
           map.set(dateString, list);
        });
        return map;
    }

    getAverageWeightForDay(weighInByDayMap:Map<string, WeighIn[]>):Map<string, number>{
        let toReturn:Map<string, number> = new Map<string, number>();
        weighInByDayMap.forEach(function(value:WeighIn[], key:string, map:Map<string, WeighIn[]>){
            let total:number = 0;
            let count:number = 0;
            value.forEach(weighIn => {
                total = total + weighIn.weight;
                count++;
            });
            let average:number = total/count;
            toReturn.set(key, average);
        });
        return toReturn;
    }

    getDateStringFromDate(date:Date):string{
       return (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear().toString().substr(2,2);
    }
}
