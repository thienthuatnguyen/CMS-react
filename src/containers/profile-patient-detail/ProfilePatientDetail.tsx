import { Accordion, AccordionDetails, AccordionSummary, Avatar, Backdrop, Breadcrumbs, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Grid, IconButton, Link, Modal, Switch, Theme, createStyles, makeStyles } from "@material-ui/core";
import "../profile-patient/ProfilePatient.scss";
import deleteIcon from "../../assets/images/delete-red.svg";
import editIcon from "../../assets/images/edit-black.svg";
import addIcon from "../../assets/images/icon-user-create.png";
import nextIcon from "../../assets/images/arrow-right.svg";

// import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from '../../assets/images/arrow-accordion.svg';
import { UploadFileImage } from "../../components/uploadFileImage/UploadFileImage";
import React, { useEffect, useState } from "react";
import ProfileUpsert from "../../components/profile-upsert/ProfileUpsert";
import { useNavigate, useParams } from "react-router-dom";
import profileService from "../../services/profileService";
import ToastMessage from "../../components/toast-message/ToastMessage";
import { connect } from "react-redux";
import hopitalService from "../../services/hospitalService";
import { setDepartmentId, setDoctorId, setDoctorName, setHospitalId, setProfileId } from "../../actions/actions";
import { LoadingData } from "../../components/loading-data/loading-data";

const DeleteIcon = () => (<img src={deleteIcon} alt="delete-icon"></img>);
const EditIcon = () => (<img src={editIcon} alt="edit-icon"></img>);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),

);
function ProfilePatientDetailPage(props: { profileIdProp, hospitalIdProp, doctorIdProp, departmentIdProp, setProfileIdProp, setHospitalIdProp, setDoctorIdProp, setDepartmentIdProp, setDoctorNameProp }) {
  const navigate = useNavigate();
  const params: any = useParams();
  const [open, setOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [profileInfo, setProfileInfo] = React.useState({
    full_name: '',
    birthday: '',
    code: '',
    phone_number: '',
    address: '',
    id: ''

  });
  const [loadingProfileInfo, setLoadingProfileInfo] = React.useState(false);

  const [configToast, setToastConfig] = useState({ type: '', isOpen: false, message: '' });
  const [bookingList, setBookingList] = React.useState([]);
  const [loadingResultList, setLoadingResultList] = React.useState(false);
  const [bookedList, setBookedList] = React.useState<any>([]);
  const [loadingBookedList, setLoadingBookedList] = React.useState<any>(false);
  const [checked, setChecked] = React.useState(true);

  useEffect(() => {
    if (params && params.patentId && params.patentId != '') {
      getProfileUser();

      profileService.getBookingList(params.patentId).then(
        (res) => {
          setBookedList([]);
          let body = res.data;
          if (body && body.error) {
            setToastConfig({ type: 'error', isOpen: true, message: body.message });
          } else {
            setBookingList(body.data.doctors);
            if (body.data && !body.data.doctors.length) {
              setLoadingBookedList(true);
            } else {
              body.data.doctors.map((el: any) => {
                getBookingDetail(el.id)
              })

            }
            setLoadingResultList(true);

          }
        }
      )

    } else {
      navigate('/404');
    }

  }, []);
  function uploadData(image, id) {
    profileService.createMedicalResult(image, id).then(
      (res) => {
        let body = res.data;
        if (body && body.error) {
          setToastConfig({ type: 'error', isOpen: true, message: body.message });
        } else {
          setToastConfig({ type: 'success', isOpen: true, message: 'Cập nhật kết quả khám thành công!' });
        }
      }
    )
  }
  function getBookingDetail(id) {
    hopitalService.getBookingDetails(id).then(
      (res) => {
        let body = res.data;
        if (body && body.error) {
          setToastConfig({ type: 'error', isOpen: true, message: body.message });
        } else {
          setBookedList(oldArray => [...oldArray, body.data.booking]);
          setLoadingBookedList(true);
        }
      }
    )
  }
  function closeToast() {
    setToastConfig({ type: '', isOpen: false, message: '' });
  }
  const handleViewDetail = () => {
    setOpen(true);
  };

  function getProfileUser() {
    profileService.findMedicalProfile(params.patentId).then(
      (res) => {
        let body = res.data;
        if (body && body.error) {
          setToastConfig({ type: 'error', isOpen: true, message: body.message });
        } else {
          setProfileInfo(body.data.profile);
          setChecked(body.data.profile.is_default ? true : false);
          setLoadingProfileInfo(true);
        }
      }
    )

  }

  const handleClose = (isChange) => {
    if(isChange == true) {
      getProfileUser();
      setToastConfig({ type: 'success', isOpen: true, message: 'Bạn đã cập nhật hồ sơ thành công!' });
    }
    setOpen(false);

  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClickOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const classes = useStyles();
  function handleDeleteConfirm(id) {
    profileService.deleteMedicalProfile(id).then((res) => {
      let body = res.data;
      if (body && body.error) {
        setToastConfig({ type: 'error', isOpen: true, message: body.message });
      } else {
        setToastConfig({ type: 'success', isOpen: true, message: 'Xóa hồ sơ thành công!' });
        handleCloseConfirm();
        navigate('/');
      }
    });
  }

  function setProfile(id, url) {
    props.setProfileIdProp(id);
    navigate(url);
  }
  function preBooking(item: any) {
    if (item.profile_id) {
      props.setProfileIdProp(item.profile_id);
    }
    if (item.doctor && item.doctor.fullname) {
      props.setDoctorNameProp(item.doctor.fullname);
    }
    if (item.doctor_id) {
      props.setDoctorIdProp(item.doctor_id);
      props.setDepartmentIdProp('');
    }
    if (item.hospital_id) {
      props.setHospitalIdProp(item.hospital_id);
    }
    if (item.department_id) {
      props.setDoctorIdProp('');
      props.setDoctorNameProp('');
      props.setDepartmentIdProp(item.department_id);
    }
    navigate('/dat-lich-kham');
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    let isDefault = 0;
    if (event.target.checked == true) {
      isDefault = 1;
    }

    profileService.updateMedicalProfile(profileInfo.id, { is_default: isDefault }).then((res) => {
      let body = res.data;
      if (body && body.error) {
        setToastConfig({ type: 'error', isOpen: true, message: body.message });
      } else {
        setToastConfig({ type: 'success', isOpen: true, message: 'Bạn đã cập nhật hồ sơ thành công!' });
      }
    })
  };

  return (
    <React.Fragment>
      <ToastMessage isOpen={configToast.isOpen} closeCallback={closeToast} type={configToast.type} message={configToast.message}></ToastMessage>
      <div className="wrapper-profile-patient-page">
        <div className="container-app">
          <h1 className="title">Hồ sơ bệnh nhân</h1>
          <div className="top-title-page">

            <Breadcrumbs aria-label="breadcrumb" className="my-breadcrumb">
              <Link onClick={() => { navigate("/ho-so-benh-nhan") }}>
                Hồ sơ bệnh nhân
              </Link>
              <h2>Chi tiết hồ sơ của bạn</h2>

            </Breadcrumbs>
            <Button onClick={() => { navigate("/tao-ho-so") }}
              variant="contained"
              className="my-btn btn-blue-dash btn-contained large-size btn-create-profile"
              startIcon={<Avatar
                src={
                  addIcon
                }
              />}
            >
              Tạo hồ sơ của bạn
            </Button>

          </div>
          <div className="list-profile">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>

                <div className="box-profile">
                  <div className="top-info">
                    <div className="name">{loadingProfileInfo ? profileInfo.full_name : <LoadingData variant="text" width={'100px'} count={1}></LoadingData>}</div>
                    <div className="group-action">
                      <IconButton onClick={handleClickOpenConfirm} aria-label="delete" className="btn-delete-profile">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleViewDetail()} aria-label="delete" className="btn-edit-profile">
                        <EditIcon />
                      </IconButton>
                    </div>
                  </div>
                  <div className="content-info">
                    <div className="row-content-info">
                      <div className="col-content-info birthday">Ngày sinh:</div>
                      <div className="col-content-info">{loadingProfileInfo ? profileInfo.birthday : <LoadingData key={'birthday'} variant="text" width={'50%'} count={1}></LoadingData>}</div>
                    </div>
                    <div className="row-content-info">
                      <div className="col-content-info code">Mã hồ sơ bệnh nhân:</div>
                      <div className="col-content-info">{loadingProfileInfo ? profileInfo.code : <LoadingData key={'code'} variant="text" width={'60%'} count={1}></LoadingData>}</div>
                    </div>
                    <div className="row-content-info">
                      <div className="col-content-info phone">Số điện thoại:</div>
                      <div className="col-content-info">{loadingProfileInfo ? profileInfo.phone_number : <LoadingData key={'phone'} variant="text" width={'70%'} count={1}></LoadingData>}</div>
                    </div>
                    <div className="row-content-info">
                      <div className="col-content-info address">Địa chỉ:</div>
                      <div className="col-content-info">{loadingProfileInfo ? profileInfo.address : <LoadingData key={'address'} variant="text" width={'95%'} count={1}></LoadingData>}</div>
                    </div>

                  </div>
                  <div className="default-toogle">
                    <div className="text">Đặt làm hồ sơ mặc định:</div>
                    <div className="toogle-button">{loadingProfileInfo ? <Switch
                      checked={checked}

                      color="primary"
                      onChange={handleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    /> : <LoadingData variant="text" width={'95%'} count={1}></LoadingData>}</div>
                  </div>
                  <div className="btn-booking">
                    <Button className="my-btn btn-text-blue" onClick={() => { setProfile(profileInfo.id, '/dat-kham-theo-bac-si') }}>Đặt khám theo bác sĩ</Button>
                    <Button className="my-btn btn-text-blue" onClick={() => { setProfile(profileInfo.id, '/dat-kham-theo-benh-vien') }}>Đặt khám theo bệnh viện</Button>
                    <Button className="my-btn btn-text-blue" onClick={() => { setProfile(profileInfo.id, '/dat-cham-soc-tai-nha') }}>Đặt chăm sóc tại nhà</Button>
                  </div>

                </div>

              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <div className="box-profile box-profile-result">
                  <div className="top-info">
                    <div className="title">Tải kết quả khám</div>
                  </div>
                  <div className="content-info">
                    {!loadingResultList && <LoadingData variant="text" width={'100%'} count={3}></LoadingData>}
                    {loadingResultList && <React.Fragment>
                      {bookingList.length <= 0 && (
                        <div>Bạn chưa thể tải lên kết quả khám do hồ sơ bạn chưa đặt khám !</div>
                      )}
                      {bookingList.map((item: any, index) => (
                        <Accordion key={index} className="my-accordion">
                          <AccordionSummary
                            expandIcon={<Avatar
                              src={
                                ExpandMoreIcon
                              }
                            />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <div className="header-content">
                              <div className="date-text">{item.date_book}</div>
                              <div className="date-text">{item.department?.title ? item.department?.title + '-' : ''}  {item.hospital.title}</div>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="detail-content">
                              <UploadFileImage medicalResult={item.meidcal_result} id={'id' + index} callBackData={(val) => uploadData(val, item.id)}></UploadFileImage>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </React.Fragment>}

                  </div>
                </div>
              </Grid>
            </Grid>
            <div className="box-profile box-profile-schedule">
              <div className="top-info">
                <div className="title">Danh sách đặt khám</div>
              </div>
              <div className="content-info content-info-list-shedule">
                {!loadingBookedList && <LoadingData variant="text" width={'100%'} count={3}></LoadingData>}
                {loadingBookedList && <React.Fragment>
                  {(bookedList.length <= 0) &&
                    <div>Hồ sơ của bạn chưa đặt khám</div>}
                  {(bookedList.length > 0) && <React.Fragment>
                    <div className="row-schedule row-schedule-header">
                      <div className="col-item">Ngày đặt khám</div>
                      <div className="col-item">Số thứ tự khám</div>
                      <div className="col-item">Bệnh viện</div>
                      <div className="col-item">Khoa</div>
                      <div className="col-item">Bác sĩ</div>
                      <div className="col-item">Dịch vụ khám</div>
                      <div className="col-item"></div>
                    </div>
                    {bookedList.map((el: any, index: any) => (
                      <div className="row-schedule" key={index}>
                        <div className="col-item">{el.date_book} - {el.time_book}</div>
                        <div className="col-item">{el.order_number}</div>
                        <div className="col-item">{(el.hospital && el.hospital.title) ? el.hospital.title : 'N/A'}</div>
                        <div className="col-item">{(el.department && el.department.title) ? el.department.title : 'Chưa xác định'}</div>
                        <div className="col-item">{(el.doctor && el.doctor.fullname) ? el.doctor.fullname : 'Chưa xác định'}</div>
                        <div className="col-item">{(el?.service !== null) ? el.service.title : 'Chưa xác định'}</div>
                        <div className="col-item">
                          <Button
                            onClick={() => preBooking(el)}
                            size="small"
                            variant="contained"
                            className="my-btn btn-green btn-contained"
                            endIcon={<Avatar
                              src={
                                nextIcon
                              }
                            />}
                          >
                            Đặt tái khám
                          </Button>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>}
                </React.Fragment>
                }
              </div>

              <div className="content-info-list-shedule content-info-list-shedule-mobile">
                {(bookedList.length <= 0) &&
                  <div>Hồ sơ của bạn chưa đặt khám</div>}

                {
                  bookedList.map((el: any, index: any) => (
                    <div className="table-schedulr" key={index}>
                      <div className="row-schedule">
                        <div className="col-item">Ngày đặt khám</div>
                        <div className="col-item">{el.date_book} - {el.time_book}</div>
                      </div>
                      <div className="row-schedule">
                        <div className="col-item">Số thứ tự khám</div>
                        <div className="col-item">{el.order_number}</div>
                      </div>
                      <div className="row-schedule">
                        <div className="col-item">Bệnh viện</div>
                        <div className="col-item">{(el.hospital && el.hospital.title) ? el.hospital.title : 'N/A'}</div>
                      </div>
                      <div className="row-schedule">
                        <div className="col-item">Khoa</div>
                        <div className="col-item">{(el.department && el.department.title) ? el.department.title : 'Chưa xác định'}</div>
                      </div>
                      <div className="row-schedule">
                        <div className="col-item">Bác sĩ</div>
                        <div className="col-item">{(el.doctor && el.doctor.fullname) ? el.doctor.fullname : 'Chưa xác định'}</div>
                      </div>
                      <div className="row-schedule">
                        <div className="col-item">Dịch vụ khám</div>
                        <div className="col-item">{(el?.service !== null) ? el.service.title : 'Chưa xác định'}</div>
                      </div>

                      <div className="row-schedule">
                        <div className="col-item">
                          <Button
                            onClick={() => preBooking(el)}
                            size="small"
                            variant="contained"
                            className="my-btn btn-green btn-contained"
                            endIcon={<Avatar
                              src={
                                nextIcon
                              }
                            />}
                          >
                            Đặt tái khám
                          </Button>
                        </div>
                      </div>
                    </div>)

                  )

                }
              </div>
            </div>
          </div>
        </div>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className="wrapper-my-modal my-modal-form-edit">
              <ProfileUpsert profileInfo={profileInfo} isEdit={true} callBackCloseModal={handleClose}></ProfileUpsert>
            </div>
          </Fade>
        </Modal>
        <Dialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Xóa hồ sơ</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc là muốn xóa hồ sơ này ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className="btn-reject" onClick={handleCloseConfirm} color="primary">
              Từ chối
            </Button>
            <Button className="btn-accept" onClick={() => handleDeleteConfirm(profileInfo.id)} color="primary" autoFocus>
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
const mapStateToProps = (state: any) => ({
  profileIdProp: state.profileId,
  hospitalIdProp: state.hospitalId,
  doctorIdProp: state.doctorId,
  departmentIdProp: state.departmentId
})

const mapDispatchToProps = (dispatch: any) => ({
  setProfileIdProp: (data: any) => dispatch(setProfileId(data)),
  setHospitalIdProp: (data: any) => dispatch(setHospitalId(data)),
  setDoctorIdProp: (data: any) => dispatch(setDoctorId(data)),
  setDepartmentIdProp: (data: any) => dispatch(setDepartmentId(data)),
  setDoctorNameProp: (data: any) => dispatch(setDoctorName(data))


})
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePatientDetailPage);



