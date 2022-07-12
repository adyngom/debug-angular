import { Component, OnInit } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';

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
      *ngIf="accountInfo$ | async as accountInfo; else loading"
    >
      <h1>Account {{ accountInfo.account_number }}</h1>
    </section>
    <ng-template #loading>
      <h1>Loading...</h1>
    </ng-template>
  `,
  styles: [],
})
export class AppComponent {
  config: AccountInfo = {
    account_number: null,
    account_type: null,
    account_services: null,
    account_status: null,
  };

  accountInfo$: Observable<AccountInfo> = this.getAccountInfo().pipe(
    filter((acc: AccountInfo) => {
      const isTrue = !!acc.account_status;
      return isTrue;
    }),
    take(1),
    map((acc: AccountInfo) => {
      acc = {
        ...acc,
        account_number: this.addAccountSegment(acc?.account_number!),
      };
      return acc;
    })
  );

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
        const newObj: AccountInfo = Object.assign(this.config, updates[lapse]);
        console.log(newObj.account_number);

        return newObj;
      }),
      take(updates.length)
    );
  }
}
