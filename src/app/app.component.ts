import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SwUpdate} from "@angular/service-worker";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'v1.0.0';
  private updates = inject(SwUpdate)

  constructor() {
    this.updates
      .versionUpdates.subscribe((event) => {
      switch (event.type) {
        case 'NO_NEW_VERSION_DETECTED':
          console.log('PWA: already on the latest version')
          break;
        case 'VERSION_DETECTED':
          console.log(`PWA: new version is available.`);
          console.log(`PWA: downloading new app version: ${event.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`PWA: current app version: ${event.currentVersion.hash}`);
          console.log(`PWA: app version ready for use: ${event.latestVersion.hash}`);

          if (confirm("new version, update?")) {
            document.location.reload()
          }
          break;
        case 'VERSION_INSTALLATION_FAILED':
          // TODO: installations fail always
          console.log(`PWA: failed to install app version '${event.version.hash}': ${event.error}`);
          console.error("PWA: failed to install update to version", event.version, event.error)
          break;
      }
    })

    this.updates.unrecoverable.subscribe(async event => {
      console.error('An error occurred that we cannot recover from:', event.reason)
      alert('An error occurred that we cannot recover from:' + event.reason + '\n\nPlease reload the page.')
    })
  }
}
