import React from 'react'
import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import IconButton from '@material-ui/core/IconButton'
import MenuSelectForTable from './MenuSelectForTable'
import ShowAlertForTable from './ShowAlertForTable'
import FiberManualRecordSharpIcon from '@material-ui/icons/FiberManualRecordSharp'

const useRowStyles = makeStyles({
  table: {
    minWidth: 900,
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
})

const Row = (props) => {
  const classes = useRowStyles()

  const { row, index, setAlert } = props
  const { replyComments } = row
  const [open, setOpen] = React.useState(false)

  const showAlert = (
    idComment,
    idReplyComment,
    isDeleteComment,
    isDeleteReplyComment,
  ) => {
    setAlert(
      <ShowAlertForTable
        hideAlert={hideAlert}
        idComment={idComment}
        idReplyComment={idReplyComment}
        isDeleteComment={isDeleteComment}
        isDeleteReplyComment={isDeleteReplyComment}
      />,
    )
  }

  const hideAlert = () => {
    setAlert(null)
  }

  return (
    <React.Fragment>
      <TableRow hover={true} className={classes.root}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {row && row.content}
        </TableCell>
        <TableCell align='right'>
          {row && moment(row.createdAt).format('YYYY-MM-DD')}
        </TableCell>
        <TableCell align='right'>
          {row && row.commentOwner && row.commentOwner.id}&nbsp;&nbsp;&nbsp; @
          {row && row.commentOwner && row.commentOwner.nickname}
        </TableCell>
        <TableCell align='right'>
          <MenuSelectForTable
            index={index}
            showAlert={() => showAlert(row.id, null, true, false)}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Table size='small' aria-label='purchases'>
                <TableBody>
                  {replyComments.map((item) => (
                    <TableRow hover={true} key={item && item.id}>
                      {/* <TableCell>
                        <IconButton aria-label='expand row' size='small'>
                          <FiberManualRecordSharpIcon />
                        </IconButton>
                      </TableCell> */}
                      <TableCell
                        component='th'
                        scope='row'
                        style={{
                          minWidth: 170,
                        }}
                      >
                        <IconButton size='small'>
                          <FiberManualRecordSharpIcon
                            style={{ fontSize: '.7rem' }}
                          />
                        </IconButton>
                        {item && item.content}
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{
                          minWidth: 170,
                        }}
                      >
                        {moment(item && item.createdAt).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{
                          minWidth: 170,
                        }}
                      >
                        {item && item.commentOwner && item.commentOwner.id}
                        &nbsp;&nbsp;&nbsp;@
                        {item &&
                          item.commentOwner &&
                          item.commentOwner.nickname}
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{
                          minWidth: 170,
                        }}
                      >
                        <MenuSelectForTable
                          index={index}
                          showAlert={() =>
                            showAlert(row.id, item.id, false, true)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function CollapsibleTable({ rows }) {
  const classes = useRowStyles()
  const [alert, setAlert] = React.useState(null)

  return (
    <TableContainer component={Paper}>
      {alert}
      <Table className={classes.table} aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                width: 50,
              }}
            />
            <TableCell
              style={{
                minWidth: 170,
              }}
            >
              댓글
            </TableCell>
            <TableCell
              align='right'
              style={{
                minWidth: 170,
              }}
            >
              업로드 일자
            </TableCell>
            <TableCell
              align='right'
              style={{
                minWidth: 170,
              }}
            >
              작성자
            </TableCell>
            <TableCell
              align='right'
              style={{
                minWidth: 170,
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row key={i} row={row} index={i} setAlert={setAlert} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
