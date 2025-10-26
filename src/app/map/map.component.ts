import { Component, OnInit } from '@angular/core';
import { CountryService } from '../services/country.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapSvg: SafeHtml = '';
  selectedCountry: any = null;
  countryInfo: any = null;

  constructor(
    private countryService: CountryService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadMap();
  }

  loadMap(): void {
    this.http.get('assets/map-image.svg', { responseType: 'text' }).subscribe(
      (svgContent: string) => {
        this.mapSvg = this.sanitizer.bypassSecurityTrustHtml(svgContent);
        setTimeout(() => this.attachClickHandlers(), 100);
      }
    );
  }

  attachClickHandlers(): void {
    const svgElement = document.querySelector('.map-container svg');
    if (svgElement) {
      const countries = svgElement.querySelectorAll('[id]');
      countries.forEach((country: Element) => {
        country.addEventListener('click', (event: Event) => {
          const target = event.target as SVGElement;
          const countryCode = target.id;
          if (countryCode) {
            this.onCountryClick(countryCode);
          }
        });
      });
    }
  }

  onCountryClick(countryCode: string): void {
    this.selectedCountry = countryCode;
    this.countryService.getCountryInfo(countryCode).subscribe(
      (data: any) => {
        if (data && data[1] && data[1][0]) {
          this.countryInfo = data[1][0];
        }
      },
      (error) => {
        console.error('Error fetching country data:', error);
      }
    );
  }
}