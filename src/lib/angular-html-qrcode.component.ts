import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Html5QrcodeSupportedFormats } from 'html5-qrcode';

import { Html5QrcodeError, Html5QrcodeResult, Html5QrcodeScanType, QrcodeErrorCallback, QrcodeSuccessCallback, QrDimensionFunction, QrDimensions } from 'html5-qrcode/esm/core';
import { AngularHtmlQrcodeService } from './angular-html-qrcode.service';
import { AngularHTML5QRCodeSupportedScanTypes } from '../interfaces/angular-html5-qrcode-supported-scan-types';

@Component({
  selector: 'angular-html-qrcode',
  standalone: true,

  imports: [],
  templateUrl: './angular-html-qrcode.component.html',
  styles: `

  `,
})
export class AngularHtmlQrcodeComponent {
  @Output() onSuccess = new EventEmitter<{ decodedText: string; result: Html5QrcodeResult; }>();
  @Output() onError = new EventEmitter<{ errorMessage: string; error: Html5QrcodeError; }>();
  @Input() types: Html5QrcodeSupportedFormats[] = [
    Html5QrcodeSupportedFormats.QR_CODE,
    Html5QrcodeSupportedFormats.AZTEC,
    Html5QrcodeSupportedFormats.CODABAR,
    Html5QrcodeSupportedFormats.CODE_39,
    Html5QrcodeSupportedFormats.CODE_93,
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.DATA_MATRIX,
    Html5QrcodeSupportedFormats.MAXICODE,
    Html5QrcodeSupportedFormats.ITF,
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.PDF_417,
    Html5QrcodeSupportedFormats.RSS_14,
    Html5QrcodeSupportedFormats.RSS_EXPANDED,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,

  ];
  @Input() fps: number = 10;
  @Input() selectorID: string = 'reader'
  @Input() rememberLastUsedCamera: boolean = true
  @Input() aspectRatio?: number = 1.333334;

  @Input() disableFlip: boolean = false;
  @Input() supportCameraOrFile: 'camera' | 'file' | 'both' = 'both';
  private supportedTypes: AngularHTML5QRCodeSupportedScanTypes = {
    camera: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    file: [Html5QrcodeScanType.SCAN_TYPE_FILE],
    both: [
      Html5QrcodeScanType.SCAN_TYPE_CAMERA,
      Html5QrcodeScanType.SCAN_TYPE_FILE,
    ]
  }
  @Input() qrbox: QrDimensions | QrDimensionFunction = { width: 250, height: 250 }
  constructor(public angularHtmlQrcodeService: AngularHtmlQrcodeService) { }
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.onReaderLoad()
    }, 80)
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.

  }
  onReaderLoad() {


    let qrCodeScanner = this.angularHtmlQrcodeService.html5QrcodeScanner(
      this.selectorID,
      {
        formatsToSupport: this.types,
        fps: this.fps,
        rememberLastUsedCamera: this.rememberLastUsedCamera,
        disableFlip: this.disableFlip,
        supportedScanTypes: this.supportedTypes[this.supportCameraOrFile],
        aspectRatio: this.aspectRatio,
        qrbox: this.qrbox,
      },
      true
    );
    qrCodeScanner.render(
      (decodedText: string, result: Html5QrcodeResult ) => {
        this.onSuccess.emit({ decodedText, result });
      },
      (errorMessage: string, error: Html5QrcodeError) => {
        this.onError.emit({ errorMessage, error });
      }
    );
  }
}
