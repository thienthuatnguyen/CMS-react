import { LoadingData } from "../loading-data/loading-data";

export function ProfileInfoSchedule({ profileInfo }) {
  function getGenderName() {
    switch (profileInfo.gender) {
      case '0':
        return 'Nam';
      case '1':
        return 'Nữ';
      default:
        return 'Khác'

    }
  }
  return (
    <div className="profile-info-schedule box-info box-info-first">
      <div className="box-title">Thông tin bệnh nhân</div>
      <div className="box-profile">
        <div className="top-info">
          <div className="name">{profileInfo.full_name ? profileInfo.full_name : <LoadingData variant="text" width={'100px'} count={1}></LoadingData>}</div>
        </div>
        <div className="content-info">
          <div className="row-content-info">
            <div className="col-content-info birthday">Ngày sinh:</div>
            <div className="col-content-info">{profileInfo.birthday ? profileInfo.birthday : <LoadingData variant="text" width={'50%'} count={1}></LoadingData>}</div>
          </div>
          <div className="row-content-info">
            <div className="col-content-info phone">Số điện thoại:</div>
            <div className="col-content-info">{profileInfo.phone_number ? profileInfo.phone_number : <LoadingData variant="text" width={'70%'} count={1}></LoadingData>}</div>
          </div>
          <div className="row-content-info">
            <div className="col-content-info address">Địa chỉ:</div>
            <div className="col-content-info">{profileInfo.address ? profileInfo.address : <LoadingData variant="text" width={'95%'} count={1}></LoadingData>}</div>
          </div>
          <div className="row-content-info">
            <div className="col-content-info sex">Giới tính:</div>
            <div className="col-content-info">{profileInfo.gender ? (getGenderName()) : <LoadingData variant="text" width={'50%'} count={1}></LoadingData>}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
