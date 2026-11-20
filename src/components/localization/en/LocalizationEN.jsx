import React, { useState, useMemo } from 'react';
import {
  Tabs,
  Table,
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  Space,
  Modal,
  message,
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  MinusCircleOutlined,
  CopyOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import PageHeader from '../../../layouts/layoutcomponents/pageheader';
import {
  useAddNewLanguageMutation,
  useGetAllTranslationDataQuery,
} from '../../../redux/features/localizationAPIEndPoint';
import Loader from '../../../layouts/layoutcomponents/loader';
import { usePermissions } from '../../../commondata/usePermissions';

const { Search } = Input;

export default function LocalizationEN() {
  const { role } = usePermissions();
  const withLang = (lang) => (role === "SuperAdmin" ? lang : undefined);
  const { data: res, isLoading, refetch } = useGetAllTranslationDataQuery(withLang("english"));
  const { data: resFA, refetch: refetchFA } = useGetAllTranslationDataQuery(withLang("persian"));
  const { data: resAR, refetch: refetchAR } = useGetAllTranslationDataQuery(withLang("arabic"));

  const [addNewLanguage, { isLoading: loading }] = useAddNewLanguageMutation();

  const allData = res?.data?.[0] || {};
  const allDataFA = resFA?.data?.[0] || {};
  const allDataAR = resAR?.data?.[0] || {};

  const [editingKey, setEditingKey] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const tableData = Object.keys(allData).map((key, index) => ({
    key: index,
    english: key,
    translation: allData[key],
  }));

  /** ✅ Add multiple English translations inline */
  const handleAddMultiple = async (values) => {
    try {
      const newEnglish = {};
      const newArabic = {};
      const newPersian = {};

      values.english.forEach((entry) => {
        const { english, translation } = entry;
        if (english) {
          newEnglish[english] = translation || '';
          newArabic[english] = '';  // empty value for Arabic
          newPersian[english] = ''; // empty value for Persian
        }
      });

      // Merge new data with existing English
      const mergedEnglish = { ...newEnglish };

      // For English and Arabic, just add empty keys if missing
      const mergedPersian = { ...newPersian };
      const mergedArabic = { ...newArabic };

      // ✅ Final payload
      const updatedTranslations = {
        english: [mergedEnglish],
        persian: [mergedPersian],
        arabic: [mergedArabic],
      };

      const res = await addNewLanguage(updatedTranslations);
      if (res?.data?.http_status_code === 200 || res?.data?.http_status_code === 201) {
        refetch();
        refetchFA();
        refetchAR();
        addForm.resetFields();
        setShowAddForm(false);
        message.success('English translations added successfully!');
      }
    } catch (error) {
      console.error('Error adding translations:', error);
      message.error('Failed to add translations.');
    }
  };

  /** ✅ Start editing (open popup) */
  const handleEdit = (record) => {
    setEditingKey(record.english);
    editForm.setFieldsValue({
      english: record.english,
      translation: record.translation,
    });
    setEditModalVisible(true);
  };

  /** ✅ Save edited translation (from popup) */
  const handleSaveEdit = async (values) => {
    try {
      const payload = {
        english: [{
          ...(editingKey !== values.english && { [editingKey]: null }),
          [values.english]: values.translation,
        }],
      };
      const res = await addNewLanguage(payload);

      if (res?.data?.http_status_code === 200 || res?.data?.http_status_code === 201) {
        refetch();
        setEditingKey(null);
        setEditModalVisible(false);
        message.success('English translation updated successfully!');
      }
    } catch (error) {
      console.error('Error saving edit:', error);
      message.error('Failed to save changes.');
    }
  };


  /** ✅ Save edited translation (from popup) */
  // const handleSaveEdit = async (values) => {
  //   try {
  //     // ✅ Convert object to array of entries to preserve order
  //     const entries = Object.entries(allData);

  //     // ✅ Find index of the key being edited
  //     const index = entries.findIndex(([key]) => key === editingKey);

  //     if (index === -1) {
  //       message.error("Key not found!");
  //       return;
  //     }

  //     // ✅ Prepare new key/value
  //     const newKey = values.english;
  //     const newValue = values.translation;

  //     // ✅ Update the entry at the SAME index
  //     entries[index] = [newKey, newValue];

  //     // ✅ Convert back to object while maintaining order
  //     const updated = Object.fromEntries(entries);

  //     const updatedTranslations = { english: [updated] };

  //     const res = await addNewLanguage(updatedTranslations);

  //     if (res?.data?.http_status_code === 200 || res?.data?.http_status_code === 201) {
  //       refetch();
  //       setEditingKey(null);
  //       setEditModalVisible(false);
  //       message.success("English translation updated successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error saving edit:", error);
  //     message.error("Failed to save changes.");
  //   }
  // };


  /** ✅ Search filter logic */
  const filteredData = useMemo(() => {
    if (!searchText) return tableData;
    const lower = searchText.toLowerCase();
    return tableData.filter(
      (item) =>
        item.english.toLowerCase().includes(lower) ||
        item.translation.toLowerCase().includes(lower)
    );
  }, [searchText, tableData]);

  const columns = [
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
    {
      title: 'English Text',
      dataIndex: 'english',
      key: 'english',
      width: '40%',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'English Translation',
      dataIndex: 'translation',
      key: 'translation',
      render: (text) => <span>{text}</span>,
    },
  ];

  /** ✅ Tabs configuration */
  const items = [
    {
      key: '1',
      label: 'All Translations',
      children: (
        <>
          <Space style={{ marginBottom: 16 }}>
            {!showAddForm && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowAddForm(true)}
              >
                Add New
              </Button>
            )}
          </Space>

          {/* Add New Section */}
          {showAddForm && (
            <Card bordered style={{ marginBottom: 24 }}>
              <Form form={addForm} layout="vertical" onFinish={handleAddMultiple}>
                <Form.List name="english" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          align="baseline"
                          style={{ display: 'flex', marginBottom: 8 }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, 'english']}
                            label="English"
                            rules={[{ required: true, message: 'Enter English text' }]}
                          >
                            <Input placeholder="Enter English text" style={{ width: 250 }} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'translation']}
                            label="Translation"
                            rules={[{ required: true, message: 'Enter translation' }]}
                          >
                            <Input placeholder="Enter English translation" style={{ width: 300 }} />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ color: 'red' }}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Another
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                      Save
                    </Button>
                    <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Translation Table */}
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            bordered
          />

          {/* Edit Popup Modal */}
          <Modal
            title="Edit Translation"
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
          >
            <Form form={editForm} layout="vertical" onFinish={handleSaveEdit}>
              <Form.Item
                name="english"
                label="English"
                rules={[{ required: true, message: 'Enter English text' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="translation"
                label="Translation"
                rules={[{ required: true, message: 'Enter translation' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Save
                  </Button>
                  <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </>
      ),
    },

    /** ✅ Search Tab */
    {
      key: '2',
      label: 'Search Translation',
      children: (
        <Card bordered>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Search
              placeholder="Search by English or Translation text..."
              allowClear
              enterButton={<><SearchOutlined /> Search</>}
              size="large"
              onSearch={(value) => setSearchText(value.trim())}
              onChange={(e) => setSearchText(e.target.value.trim())}
            />

            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={{ pageSize: 10 }}
              bordered
              style={{ marginTop: 16 }}
            />
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <>
      {(isLoading || loading) && <Loader />}
      <Row className="align-items-center mb-4">
        <Col>
          <PageHeader
            titles="Localization"
            active="English"
            items={['Home']}
            links={['/dashboard']}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Card bordered>
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
