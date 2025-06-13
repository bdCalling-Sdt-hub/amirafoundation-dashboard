'use client';

import { Table } from 'antd';
import { Tooltip } from 'antd';
import { ConfigProvider } from 'antd';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

import ProfileModal from '@/components/SharedModals/ProfileModal';
import { Tag } from 'antd';
import { useGetAllusersQuery } from '@/redux/api/userApi';
import moment from 'moment';

export default function AccDetailsTable() {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedUser, SetSelecteduser] = useState('');

  // User data with query parameterss
  const { data, isLoading } = useGetAllusersQuery({
    limit: 5,
    page: currentPage,
    searchText,
  });

  console.log(setCurrentPage);
  console.log(setSearchText);

  // Table Data transformation
  const tabledata =
    data?.data?.map((item, inx) => ({
      key: inx + 1 + (currentPage - 1) * 10,
      name: item?.name,
      userImg: item?.photoUrl,
      email: item?.email,
      contact: item?.contactNumber,
      date: moment(item?.createdAt).format('DD-MM-YYYY'),
      status: item?.status,
    })) || [];

  // Table Columns (unchanged)
  const columns = [
    { title: 'Serial', dataIndex: 'key', render: (value) => `#${value}` },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value, record) => {
        // Helper function to validate URL
        const isValidUrl = (url) => {
          if (!url) return false;
          return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
        };

        // Get the first letter of the name (uppercase)
        const firstLetter = value ? value.charAt(0).toUpperCase() : '';

        // Determine if the image is valid
        const hasValidImage = isValidUrl(record?.userImg);

        return (
          <div className="flex-center-start gap-x-2">
            {hasValidImage ? (
              <Image
                src={record?.userImg}
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full w-10 h-auto aspect-square"
              />
            ) : (
              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-[#A57EA5] text-white text-lg font-medium">
                {firstLetter}
              </div>
            )}
            <p className="font-medium">{value}</p>
          </div>
        );
      },
    },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Contact', dataIndex: 'contact' },
    { title: 'Date', dataIndex: 'date' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => (
        <div>
          <Tag color={value === 'active' ? '#32CD32' : '#F16365'}>{value}</Tag>
        </div>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <div className="flex-center-start gap-x-3">
          <Tooltip title="Show Details">
            <button
              onClick={() => {
                SetSelecteduser(record);
                setProfileModalOpen(true);
              }}
            >
              <Eye color="#1B70A6" size={22} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1B70A6', colorInfo: '#1B70A6' } }}>
      <h1 className="text-2xl font-medium my-3">Recent Joined user</h1>
      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        dataSource={tabledata}
        scroll={{ x: '100%' }}
        pagination={false}
        loading={isLoading}
      />
      <ProfileModal open={profileModalOpen} setOpen={setProfileModalOpen} user={selectedUser} />
    </ConfigProvider>
  );
}
