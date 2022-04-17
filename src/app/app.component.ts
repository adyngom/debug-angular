import { Component, OnInit } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { filter, take, map, switchMap, tap, catchError } from 'rxjs/operators';

interface AccountInfo {
  account_number: string | null;
  account_type: string | null;
  account_services: [string] | null;
  account_status: 'active' | 'inactive' | 'pending' | 'suspended' | null;
  available_balance?: string | null;
}

@Component({
  selector: 'app-root',
  template: `
    <section
      class="container"
      *ngIf="!!accountInfo?.account_number; else loading"
    >
      <h1>Account {{ accountInfo.account_number }}</h1>
    </section>
    <ng-template #loading>
      <h1>Loading...</h1>
    </ng-template>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  config: AccountInfo = {
    account_number: null,
    account_type: null,
    account_services: null,
    account_status: null,
  };

  accountInfo!: AccountInfo;

  ngOnInit(): void {
    this.getAccountInfo()
      .pipe(
        filter((acc: AccountInfo) => {
          console.log(acc);
          let isTrue = !!acc.account_status;
          return isTrue;
        }),
        take(1),
        map((acc: AccountInfo) => {
          this.accountInfo = {
            ...acc,
            account_number: this.addAccountSegment(acc?.account_number!),
          };
          console.table(this.accountInfo);
          return this.accountInfo;
        }),
        tap(() => {
          console.log('done');
        })
      )
      .subscribe();
  }

  private addAccountSegment(accountNumber: string): string {
    return `#${accountNumber}-prd`;
  }

  private getAccountInfo(): Observable<AccountInfo> {
    const updates = [
      {
        account_type: 'residential',
      },
      {
        account_services: ['internet', 'phone', 'cable'],
      },
      {
        account_number: '123456789',
      },
      {
        account_status: 'active',
      },
    ];

    const seq = timer(0, 1000);

    return seq.pipe(
      map((lapse) => {
        const newObj = Object.assign(this.config, updates[lapse]);
        console.log(newObj);
        return newObj;
      }),
      take(updates.length)
    );
  }
}
