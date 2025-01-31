import React from 'react'
import capitalize from 'lodash/capitalize'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CustomTextField from 'components/Gm-TextField/TextField'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import Spinner from 'components/Spinner/Spinner'

import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import Button from 'components/CustomButtons/Button.js'

import tagApi from 'api/tagApi'
import { connect } from 'react-redux'
import {
  requestTagAction,
  createTagAction,
  createTagErrAction,
  getListTagsAction,
  deleteTagAction,
  orderTagAction,
} from 'redux/actions/tagManaging'

import styles from 'assets/jss/material-dashboard-pro-react/views/MainManaging/tagManaging'
const useStyles = makeStyles(styles)

const TagManaging = (props) => {
  const {
    requestTagAction,
    createTagAction,
    createTagErrAction,
    deleteTagAction,

    getListTagsAction,
    orderTagAction,
    loading,
    tags,
  } = props

  const [formData, setFormData] = React.useState('')
  const [loadingSpinner, setLoadingSpinner] = React.useState(true)
  const [stateOfAlert, setStateOfAlert] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
  })
  const [filter, setFilter] = React.useState({
    limit: 10,
    offset: 1,
  })

  const classes = useStyles()

  // fn for show & hide alert
  const { open, vertical, horizontal, message } = stateOfAlert
  const handleClick = (newState) => {
    setStateOfAlert({ open: true, ...newState })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setStateOfAlert({ ...stateOfAlert, open: false })
  }

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const changeIndexOfArr = async (up, down, numOrder, tagId, index) => {
    const deepCloneData = [...tags]
    const currentIndex = index
    if (up) {
      if (index !== 0) {
        requestTagAction()
        try {
          let changeUpIndex = index - 1
          let body = {
            tagId,
            action: 'UP',
          }
          await tagApi.updateTag(body)

          let updateNumOrder = deepCloneData.map((item, i) => {
            if (currentIndex === i) {
              item.numOrder = item.numOrder - 1
            }

            if (changeUpIndex === i) {
              item.numOrder = item.numOrder + 1
            }

            return item
          })

          updateNumOrder.sort((a, b) => a.numOrder - b.numOrder)
          orderTagAction(updateNumOrder)
        } catch (error) {
          console.log(error.response)
        }
      }
    } else if (down) {
      if (index !== deepCloneData.length - 1) {
        requestTagAction()
        try {
          let changeDownIndex = index + 1
          let body = {
            tagId,
            action: 'DOWN',
          }
          await tagApi.updateTag(body)

          let updateNumOrder = deepCloneData.map((item, i) => {
            if (currentIndex === i) {
              item.numOrder = item.numOrder + 1
            }

            if (changeDownIndex === i) {
              item.numOrder = item.numOrder - 1
            }

            return item
          })

          updateNumOrder.sort((a, b) => a.numOrder - b.numOrder)
          orderTagAction(updateNumOrder)
        } catch (error) {
          console.log(error.response)
        }
      }
    }
  }

  // createTag Btn
  const onChange = (e) => {
    if (e.target.value.length > 49) {
      handleClick({
        vertical: 'top',
        horizontal: 'center',
        message: '50자 이하로 입력해주시기 바랍니다.',
      })
      return
    }
    setFormData(e.target.value)
  }
  const createTag = async () => {
    let convertInputTag
    if (formData.includes('#')) {
      convertInputTag = formData
    } else {
      convertInputTag = `#${formData}`
    }

    const body = {
      tagName: convertInputTag,
    }

    try {
      requestTagAction()
      const { data } = await tagApi.createTag(body)
      createTagAction(data)
      handleClick({ vertical: 'top', horizontal: 'center', message: '성공' })
      setFormData('')
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.data
      ) {
        createTagErrAction(error.response.data)
        if (error.response.data.data.isShow === true) {
          handleClick({
            vertical: 'top',
            horizontal: 'center',
            message: error.response.data.data.error,
          })
        } else {
          handleClick({
            vertical: 'top',
            horizontal: 'center',
            message: '오류',
          })
        }
      }
    }
  }

  // delete tag
  const deleteTag = async (tagId) => {
    const params = {
      tagId,
    }

    try {
      requestTagAction()
      await tagApi.deleteTag(params)
      deleteTagAction(tagId)
      handleClick({
        vertical: 'top',
        horizontal: 'center',
        message: 'success',
      })
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.data
      ) {
        createTagErrAction(error.response.data)
        if (error.response.data.data.isShow === true) {
          handleClick({
            vertical: 'top',
            horizontal: 'center',
            message: error.response.data.data.error,
          })
        } else {
          handleClick({
            vertical: 'top',
            horizontal: 'center',
            message: 'error',
          })
        }
      }
    }
  }

  // Get list tag and paginations
  React.useEffect(() => {
    const getListTags = async () => {
      let params = {
        ...filter,
      }

      if (!params.tagName) {
        delete params.tagName
      }

      try {
        requestTagAction()
        const { data } = await tagApi.getListTags(params)
        getListTagsAction(data)
        setLoadingSpinner(false)
      } catch (error) {
        setLoadingSpinner(false)
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.data
        ) {
          createTagErrAction(error.response.data)
          if (error.response.data.data.isShow === true) {
            handleClick({
              vertical: 'top',
              horizontal: 'center',
              message: error.response.data.data.error,
            })
          } else {
            handleClick({
              vertical: 'top',
              horizontal: 'center',
              message: 'error',
            })
          }
        }
      }
    }

    getListTags()
  }, [filter])

  return (
    <>
      {loadingSpinner ? (
        <Spinner />
      ) : (
        <div className='tag-managing'>
          <Paper className={classes.paper} variant='outlined' square>
            <GridContainer>
              <GridItem
                className={classes.symBolTag}
                container
                alignItems='center'
                justifyContent='center'
                xs={1}
                sm={1}
                md={1}
                lg={1}
                xl={1}
              >
                <p>#</p>
              </GridItem>
              <GridItem
                container
                alignItems='center'
                xs={8}
                sm={4}
                md={4}
                lg={4}
                xl={4}
              >
                <CustomTextField
                  className={classes.textFieldAddTag}
                  id='tag-register-new'
                  label='태그명을 입력하세요'
                  fullWidth={true}
                  size='small'
                  onChange={onChange}
                  value={formData}
                  // defaultValue='Default Value'
                  variant='outlined'
                />
              </GridItem>
              <GridItem
                container
                justifyContent='flex-end'
                className={classes.customStyleBtn}
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
              >
                <Button disabled={loading} onClick={createTag} color='primary'>
                  등록하기
                </Button>
              </GridItem>
            </GridContainer>
          </Paper>

          {tags.map((item, i) => {
            return (
              <Paper
                key={i}
                className={classes.paper}
                variant='outlined'
                square
              >
                <GridContainer>
                  <GridItem
                    className={classes.symBolTag}
                    container
                    alignItems='center'
                    justifyContent='center'
                    xs={1}
                    sm={1}
                    md={1}
                    lg={1}
                    xl={1}
                  >
                    <p>#</p>
                  </GridItem>
                  <GridItem
                    container
                    alignItems='center'
                    xs={5}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                  >
                    <CustomTextField
                      className={classes.textField}
                      id={`tag-registered-${i}`}
                      // defaultValue='태그명'
                      value={item.tagName.replace('#', '')}
                      fullWidth={true}
                      variant='outlined'
                      size='small'
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </GridItem>
                  <GridItem
                    container
                    justifyContent='flex-end'
                    xs={3}
                    sm={5}
                    md={6}
                    lg={6}
                    xl={6}
                  >
                    <IconButton
                      disabled={loading}
                      aria-label='delete'
                      onClick={() => deleteTag(item.id)}
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </GridItem>
                  <GridItem
                    container
                    direction='column'
                    alignItems='center'
                    xs={2}
                    sm={2}
                    md={1}
                    lg={1}
                    xl={1}
                  >
                    <div>
                      <IconButton
                        size='small'
                        disabled={loading}
                        onClick={() =>
                          changeIndexOfArr(
                            true,
                            false,
                            item.numOrder,
                            item.id,
                            i,
                          )
                        }
                      >
                        <ExpandLessIcon />
                      </IconButton>
                    </div>
                    <div>
                      <IconButton
                        size='small'
                        disabled={loading}
                        onClick={() =>
                          changeIndexOfArr(
                            false,
                            true,
                            item.numOrder,
                            item.id,
                            i,
                          )
                        }
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </div>
                  </GridItem>
                </GridContainer>
              </Paper>
            )
          })}

          {/* Alert */}
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={message === 'success' ? 2500 : 6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={message === 'success' ? 'success' : 'error'}
            >
              {capitalize(message)}
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.tagManaging.loading,
    tags: state.tagManaging.tags,
    metaDataOfTags: state.tagManaging.metaDataOfTags,
  }
}

export default connect(mapStateToProps, {
  requestTagAction,
  createTagAction,
  createTagErrAction,
  deleteTagAction,
  getListTagsAction,
  orderTagAction,
})(TagManaging)
