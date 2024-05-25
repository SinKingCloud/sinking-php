import {DefaultFooter} from '@ant-design/pro-layout';
import {useModel} from "@@/plugin-model/useModel";


export default () => {
  const {initialState} = useModel('@@initialState');

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} All Right Revered ${initialState?.currentWeb?.name}`}
      links={[]}
    />
  );
};
