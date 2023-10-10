/**
 * 判断设备是否为手机
 */
export function checkMobile(): boolean {
  let i;
  const pda_user_agent_list = ["2.0 MMP", "240320", "AvantGo", "BlackBerry", "Blazer",
    "Cellphone", "Danger", "DoCoMo", "Elaine/3.0", "EudoraWeb", "hiptop", "IEMobile", "KYOCERA/WX310K", "LG/U990",
    "MIDP-2.0", "MMEF20", "MOT-V", "NetFront", "Newt", "Nintendo Wii", "Nitro", "Nokia",
    "Opera Mini", "Opera Mobi",
    "Palm", "Playstation Portable", "portalmmm", "Proxinet", "ProxiNet",
    "SHARP-TQ-GX10", "Small", "SonyEricsson", "Symbian OS", "SymbianOS", "TS21i-10", "UP.Browser", "UP.Link",
    "Windows CE", "WinWAP", "Androi", "iPhone", "iPod", "iPad", "Windows Phone", "HTC"];
  const pda_app_name_list = new Array("Microsoft Pocket Internet Explorer");
  const user_agent = navigator.userAgent.toString();
  for (i = 0; i < pda_user_agent_list.length; i++) {
    if (user_agent.indexOf(pda_user_agent_list[i]) >= 0) {
      return true;
    }
  }
  for (i = 0; i < pda_app_name_list.length; i++) {
    if (user_agent.indexOf(pda_app_name_list[i]) >= 0) {
      return true;
    }
  }
  return false;
}

/**
 * 判断是否苹果设备
 */
export function isAppleDevice() {
  const userAgent = navigator.userAgent;
  return /iPad|iPhone|Mac|iPod/.test(userAgent);
}

