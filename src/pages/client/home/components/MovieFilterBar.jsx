import React, { useEffect, useState } from "react";
import { Row, Col, Input, Select, Button } from "antd";
import { useTable } from "../../../../common/hooks/useTable";
const { Search } = Input;
const { Option } = Select;

const MovieFilterBar = ({status}) =>{
  const[searchValue, setSearchValue]= useState(null);
  const{query, onFilter} = useTable();
  useEffect(()=>{
    setSearchValue(query.search);
  },[query.search]);
  useEffect(()=>{
    onFilter({search : null});
  },[status]);
  return(
    <Row gutter={[12,12]} style={{marginBottom : 12}}>
      <Col xs={24} sm={12} md={10} lg={8}>
        <Search 
          value={searchValue}
          placeholder="Tìm theo tiêu đề ..."
          onSearch={(e)=> {
            onFilter({search : [e]});
          }}
          onChange ={(e) =>{
            if(!e.target.value) onFilter({search : null});
            setSearchValue(e.target.value);
          }}
          allowClear
          enterButton
        />
      </Col>
    </Row>
  )
}

export default MovieFilterBar;
