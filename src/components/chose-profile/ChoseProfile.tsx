import { Button, FormControl, InputLabel, MenuItem, Select, TextField, createStyles, makeStyles } from "@material-ui/core";
import imgError from "../../assets/images/square-warning-validator.svg";
import profileService from "../../services/profileService";
import { useEffect, useState } from "react";
import React from "react";
import ToastMessage from "../toast-message/ToastMessage";
import { connect } from "react-redux";
import { setDoctorId, setHospitalId, setProfileId } from "../../actions/actions";
import { useNavigate } from "react-router-dom";
import hopitalService from "../../services/hospitalService";

const useStyles = makeStyles(() =>
  createStyles({
    boxInfoBookingConfirm: {
      backgroundColor: '#c7e5f5',
      padding: '20px',
      marginBottom: '15px'
    }
  }),

);

function ChoseProfile(props: { profileIdProp, hospitalIdProp, doctorIdProp, callBackCloseModal, callBackCorfimModal, setProfileIdProp, setHospitalIdProp, setDoctorIdProp }) {
  const [profiles, setProfiles] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [configToast, setToastConfig] = useState({ type: '', isOpen: false, message: '' });
  const [error, setError] = useState(false);
  const [errorHospital, setErrorHospital] = useState(false);
  const classes = useStyles();
  const [formValues, setFormValues] = React.useState({
    profile_id: '',
    hospital_id: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (props.profileIdProp) {
      setFormValues(prevState => ({
        ...prevState,
        'profile_id': props.profileIdProp
      }));
    }
    if (props.hospitalIdProp) {
      setFormValues(prevState => ({
        ...prevState,
        'hospital_id': props.hospitalIdProp
      }));
    }
    getProfiles();
    getHospitals();
  }, []);




  const onSubmit = (data) => {
    if (!data.profile_id) {
      setError(true);
    }
    if (!data.hospital_id) {
      setErrorHospital(true);
    }
    if (data.profile_id && data.hospital_id) {
      props.setProfileIdProp(data.profile_id);
      props.setHospitalIdProp(data.hospital_id);
      props.callBackCorfimModal(data);
    }

  };

  function closeToast() {
    setToastConfig({ type: '', isOpen: false, message: '' });
  }
  function getProfiles() {
    profileService.getListMedicalProfile({}).then(
      (res) => {
        let body = res.data;
        if ((body.error === false) && body.data) {
          setProfiles(body.data.profiles);
          if (!props.profileIdProp) {
            let defaultProfile;
            defaultProfile = body.data.profiles.filter(el => {
              return el.is_default == 1;
            })
            if (defaultProfile[0] && defaultProfile[0].id) {
              setFormValues(prevState => ({
                ...prevState,
                'profile_id': defaultProfile[0]?.id
              }));
            }

          }

        }
      }
    )
  }

  function getHospitals() {
    hopitalService.getHospitals({ doctor_id: props.doctorIdProp }).then(
      (res) => {
        let body = res.data;
        if ((body.error === false) && body.data) {
          if (!props.hospitalIdProp) {
            if (body.data.hospitals.length)
              setFormValues(prevState => ({
                ...prevState,
                'hospital_id': body.data.hospitals[0]?.id
              }));
          }
          setHospitals(body.data.hospitals);
        }
      }
    )
  }


  function handleProfileChange(item) {
    setError(false);
    setFormValues(prevState => ({
      ...prevState,
      'profile_id': item.target.value
    }));
  }

  function handleHospitalChange(item) {
    setError(false);
    setFormValues(prevState => ({
      ...prevState,
      'hospital_id': item.target.value
    }));
  }
  function handleCloseModal() {
    props.callBackCloseModal();
  }

  function getProfileName() {
    if (formValues.profile_id && profiles.length) {
      let array: any = profiles.filter((el: any) => { return el.id === formValues.profile_id });
      return array[0]?.full_name + ' (mã hồ sơ: ' + array[0]?.code + ')';
    } else {
      return null;
    }

  }

  function getHospitalName() {
    if (formValues.hospital_id && hospitals.length > 0) {
      let array: any = hospitals.filter((el: any) => { return el.id == formValues.hospital_id });
      return array[0]?.title;
    } else {
      return null;
    }

  }

  return (
    <React.Fragment>
      <ToastMessage isOpen={configToast.isOpen} closeCallback={closeToast} type={configToast.type} message={configToast.message}></ToastMessage>

      <form className="wrapper-form">
        {profiles.length <= 0 &&
          <React.Fragment>
            <p>Bạn chưa có hồ sơ nào, vui lòng tạo hồ sơ để đặt khám !</p>
            <div className="button-submit-right">
              <Button onClick={() => handleCloseModal()} variant="outlined" color="primary" type="button" className="my-btn btn-outlined btn-black">
                Hủy
              </Button>
              <Button onClick={() => navigate('/tao-ho-so')} variant="contained" color="primary" type="button" className="my-btn btn-contained btn-blue-dash">
                Tạo hồ sơ
              </Button>
            </div>
          </React.Fragment>}
        {profiles.length > 0 && <React.Fragment>
          {formValues.profile_id && !formValues.hospital_id && <div className={classes.boxInfoBookingConfirm}>Bạn đã chọn hồ sơ {getProfileName()}. Vui lòng chọn bệnh viện có bác sĩ này đang làm việc.</div>}
          {!formValues.profile_id && formValues.hospital_id && <div className={classes.boxInfoBookingConfirm}>Bạn đã chọn {getHospitalName()}. Vui lòng chọn hồ sơ đặt khám.</div>}
          {formValues.profile_id && formValues.hospital_id && <div className={classes.boxInfoBookingConfirm}>Bạn đã chọn hồ sơ {getProfileName()} và {getHospitalName()}. Nếu bạn muốn thay đổi hồ sơ hoặc bệnh viện, bạn có thể chọn lại hồ sơ hoặc bệnh viện có bác sĩ này đang làm việc.</div>}

          <div className={`form-group item-input ${error ? 'has-error' : ''}`}>
            <InputLabel id="profile-label" className="label-config"><span>Chọn hồ sơ đặt khám</span></InputLabel>
            <FormControl className={'my-wrapper-select'}>
              <Select
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  getContentAnchorEl: null
                }}

                labelId="profile-label"
                value={formValues.profile_id}
                onChange={handleProfileChange}
                displayEmpty
                className={'my-select'}

              >
                <MenuItem value="" disabled>
                  Chọn hồ sơ...
                </MenuItem>
                {profiles.map((el: any, index) => (
                  <MenuItem key={index} value={el.id}>{el.full_name} - {el.code}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="form-control-feedback">
              <span className="arrow"></span>
              <img src={imgError} alt="error" />
              {error && <span id="profile-helper-text">Hồ sơ là bắt buộc.</span>}
            </div>
          </div>
          <div className={`form-group item-input ${errorHospital ? 'has-error' : ''}`}>
            <InputLabel id="profile-label" className="label-config"><span>Chọn bệnh viện đặt khám</span></InputLabel>
            <FormControl className={'my-wrapper-select'}>
              <Select
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  getContentAnchorEl: null
                }}

                labelId="profile-label"
                value={formValues.hospital_id}
                onChange={handleHospitalChange}
                displayEmpty
                className={'my-select'}

              >
                <MenuItem value="" disabled>
                  Chọn bệnh viện...
                </MenuItem>
                {hospitals.map((el: any, index) => (
                  <MenuItem key={index} value={el.id}>{el.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="form-control-feedback">
              <span className="arrow"></span>
              <img src={imgError} alt="error" />
              {errorHospital && <span id="profile-helper-text">Bệnh viện là bắt buộc.</span>}
            </div>
          </div>
          <div className="button-submit-right">
            <Button onClick={() => handleCloseModal()} variant="outlined" color="primary" type="button" className="my-btn btn-outlined btn-black">
              Hủy
            </Button>
            <Button onClick={() => onSubmit(formValues)} variant="contained" color="primary" type="button" className="my-btn btn-contained btn-blue-dash">
              Xác nhận
            </Button>
          </div>
        </React.Fragment>}
      </form>
    </React.Fragment>)
}

const mapStateToProps = (state: any) => ({
  profileIdProp: state.profileId,
  hospitalIdProp: state.hospitalId,
  doctorIdProp: state.doctorId
})

const mapDispatchToProps = (dispatch: any) => ({
  setProfileIdProp: (data: any) => dispatch(setProfileId(data)),
  setHospitalIdProp: (data: any) => dispatch(setHospitalId(data)),
  setDoctorIdProp: (data: any) => dispatch(setDoctorId(data)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ChoseProfile);
