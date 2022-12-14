import React, { useEffect, useContext, useReducer, useState } from 'react';
import { DataGrid, GridColDef, jaJP } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

import SendIcon from '@mui/icons-material/Send';
import { SliderScales, STYLE_2 } from "../components/const";

import { CircularProgress, IconButton, Stack, Typography } from '@mui/material';

import {AssignCount} from "../components/shifts/assignCount"


import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';

import { SnackbarContext } from '../contexts/snackBar';
import { ConfigContext } from '../contexts/config';
import { DefaultModal } from '../components/shared/DefaultModal';
import { NewShiftModal } from '../components/shifts/NewShiftModal';

import { SelectDate } from '../components/shared/SelectDate';
import { getMonAndDate } from '../lib/calcDate';

//----------------shiftrange----------------


const reducer = (state, action) => {
    return action;
}
let content = "";

export const ShiftEdit = ({
  value, 
  loading,
  undo,
  updateShifts,
  unassignShift,
  setLoading
}) => {

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date())
  
  const [state, dispatch] = useReducer(reducer, value);

  const sb = useContext(SnackbarContext);
  const orgConfig = useContext(ConfigContext);


  const handleClick = (comment) => {
    content = comment
    setOpen(true)
  }

  
  const handlevalue = (e, newValue, activeThumb) => {
  
    if (!Array.isArray(newValue)) {
        return;
      }
      
      const change = state.slice()
      const i = change.indexOf(change.find(v => v.id == [e.target.name]))

      if (activeThumb === 0) {
        change[i].attendance_time = Math.min(newValue[0], e.target.value[1] - orgConfig.params.min_work_time)
        dispatch(change);
      } else {
        change[i].leaving_time = Math.max(newValue[1], e.target.value[0] + 2)
        dispatch(change);
      }
    }



    const columns: GridColDef[] = [
        {
        field: 'confirmed',
        headerName: '????????????',
        width: 50,
        renderCell: (params) => <span style={{color:"green"}}>{"(???)".repeat(Number(params.row.confirmed))}</span>},
        {
          field: 'action',
          headerName: '??????',
          width:80,
          renderCell: (params) => 
          <Button 
            disabled={loading}
            variant="outlined" 
            color="error" 
            onClick={()=> {if (window.confirm("?????????????????????????????????")){
              unassignShift(params.row.id)}}
              }>
            ??????
          </Button>
        },
        // {field: 'date', headerName: '??????' },
        {field: 'name', headerName: '??????' },
        {field: "attendance_time", headerName:"???", width:30},
        {field: "leaving_time", headerName:"???", width:30},
        {
            field: 'shift',
            headerName: 'Shift',
            width: 500,
            disableClickeBubbling: true,
            renderCell: (params) => params.row.rest?
            "??????":
            
                <Slider
                    disabled={params.row.confirmed}
                    className={"?????????"}
                    getAriaLabel={() => 'Minimum distance'}
                    name={`${params.id}`}
                    value={[params.row.attendance_time,params.row.leaving_time]}
                    onChange={(e, newValue, activeThumb)=>handlevalue(e, newValue, activeThumb)}
                    marks={SliderScales}
                    valueLabelDisplay="auto"
                    min={orgConfig.params.open}
                    max={orgConfig.params.close}
                    step={0.5}
                />
          },
          {
            field: 'comment',
            headerName: '??????',
            width:50,
            renderCell: (params) => 
            params.row.comment && <IconButton onClick={()=>handleClick(params.row.comment)}>
                                    <InsertCommentOutlinedIcon color="primary"/>
                                    {console.log(params.row)}
                                  </IconButton>
          }
      ];

        return (
            <>
        <div>  
          <Stack direction="row">
          <Button variant="contained" color="warning" onClick={()=>undo()}>
            ???????????????
        </Button>   

        <div style={{marginLeft: "auto"}}>
       
              <NewShiftModal 
                orgConfig={orgConfig}
                state={state}
                dispatch={dispatch}
                date={date}
                loading={loading}
                setLoading={setLoading}
                />
             
        <Button  
            disabled={loading}
            endIcon={loading ? <CircularProgress style={{width: "1.2rem", height:"1.2rem"}}/>:<SendIcon color="inherit"/>}
            size="medium"
            variant="contained" 
            onClick={(e)=> {if(window.confirm(
              `${getMonAndDate(date)}????????????????????????????????????\n?????????????????????????????????????????????????????????`
              )){updateShifts(state)}}}
            >
        ????????????????????????
      </Button>
          </div>    

  
          </Stack>
        
      </div>
          <div style={{ height: 450, width: '100%', margin: 10 }}>
            <Stack direction="row" spacing={2}>
              <SelectDate 
                list={value}  
                setList={dispatch}
                setDate={setDate}
              />
            
              <AssignCount  params={state}/>
           
            </Stack>
              <DataGrid
                style={STYLE_2}
                rows={state}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
              />
          </div>
          <DefaultModal 
            open={open} 
            setOpen={setOpen} 
            content={content}
            />
          </>
        );
      

}
