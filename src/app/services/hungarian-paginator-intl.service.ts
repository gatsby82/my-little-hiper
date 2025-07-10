import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class HungarianPaginatorIntlService extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elemek oldalanként:';
  override nextPageLabel = 'Következő oldal';
  override previousPageLabel = 'Előző oldal';
  override firstPageLabel = 'Első oldal';
  override lastPageLabel = 'Utolsó oldal';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) {
      return 'Nincs adat';
    }

    const amountPages = Math.ceil(length / pageSize);

    return `${page + 1} / ${amountPages} oldal (összesen ${length} elem)`;
  };
}
