import numeral from 'numeral';
import ChartCard from './chartCard';
import Field from './field';

const yuan = (val: number | string) => `¥ ${numeral(val).format('0,0')}`;

const Charts = {
    yuan,
    ChartCard,
    Field,
};

export { Charts as default, yuan, ChartCard, Field };