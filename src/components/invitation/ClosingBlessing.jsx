import React from 'react';
import { Heart } from '../../utils/icons';

export function ClosingBlessing({ t, firstPerson, secondPerson, relation = '&' }) {
  return (
    <div className="closing-blessing">
      <div className="blessing-flourish">❦</div>
      <p className="blessing-text">{t.waitingWithLove}</p>
      <div className="blessing-signature">
        <span>{firstPerson}</span>
        {secondPerson && <i>{relation}</i>}
        {secondPerson && <span>{secondPerson}</span>}
      </div>
      <div className="blessing-heart">
        <Heart size={16} fill="currentColor" />
      </div>
    </div>
  );
}
