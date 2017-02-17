import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import { Geolocation } from 'ionic-native';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;

  constructor(public navCtrl: NavController, public locationTracker: LocationTracker) {
    this.loadMap();
  }

  loadMap() {

    Geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.start();
      this.handleMarker();
      setInterval(() => { this.handleMarker() }, 5000);

    }, (err) => {
      console.log(err);
    });
  }

  handleMarker() {

    let latLng = new google.maps.LatLng(this.locationTracker.lat, this.locationTracker.lng);

    if (this.marker == null) {
      this.marker = new google.maps.Marker({
        map: this.map,
        position: latLng
      });
      this.map.setCenter(latLng);
    }
    else {
      this.marker.setPosition(latLng);
      this.map.setCenter(latLng);
    }

  }

  start() {
    this.locationTracker.startTracking();
  }

  stop() {
    this.locationTracker.stopTracking();
  }

}
