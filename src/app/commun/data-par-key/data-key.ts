import { KeyNumber } from './key-number/key-number';
import { KeyUidNo } from './key-uid-no/key-uid-no';
import { IKeyNumber } from './key-number/i-key-number';
import { IKeyUidNo } from './key-uid-no/i-key-uid-no';

export type DataKey = KeyNumber | KeyUidNo;

export type IDataKey = IKeyNumber | IKeyUidNo;
