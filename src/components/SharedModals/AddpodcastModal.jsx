import { Button, Divider, Form, Input, Modal, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RiCloseLargeLine } from "react-icons/ri";
import { useCreatePodcastMutation } from "@/redux/api/podcastApi";
import { toast } from "sonner";
import { useGetPodcastCategoryQuery } from "@/redux/api/contentCategoryApi";
import { debounce } from "lodash";
import { useState } from "react";
import CreateCategoryModal from "@/app/admin/category/_components/CreateCategoryModal";
const AddpodCast = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState(""); 
  const [categoryopen,setCategoryOpen]=useState(false)


  // create new podcast api handaller

  const [create, { isLoading }] = useCreatePodcastMutation();

  // get podcast category api handeller 
  const {data,isError}=useGetPodcastCategoryQuery({searchText});


  // Debounced search handler to reduce API calls
   const handleSearch = debounce((value) => {
    setSearchText(value); // Update search text when the user types
  }, 500); // Wait for 500ms after the user stops typing before calling API




  const handleSubmit = async (values) => {
    try {
      const formdata = new FormData();
        formdata.append("data",JSON.stringify(values))
      // Handle file upload - get the first file from fileList
      if (values.image && values.image.length > 0) {
        const file = values.image[0].originFileObj;
        formdata.append("image", file);
      }
      const res = await create(formdata).unwrap();
      if (res.success) {
        toast.success("Podcast Added succesfully")
        form.resetFields()
      }
    } catch (error) {
      toast.error(error?.data?.message)
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        minWidth: "1000px",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine
          size={18}
          color="black"
          className="absolute left-1/3 top-1/3"
        />
      </div>
      <h1 className="text-center text-2xl font-semibold">Add New Podcast</h1>
      <Divider />
      <div>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          style={{
            marginTop: "40px",
          }}
        >
          <div className="flex gap-12">
            <div className="flex-1">
              {/* ===================== Episode Title ============================== */}
              <Form.Item
                label="Episode Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter Episode Title",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input size="large" placeholder="Enter Episode title"></Input>
              </Form.Item>

              {/* ========================= Number ===================== */}
              <Form.Item
                label="Episode Number"
                name="episodeNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter Episode Number",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input
                  type="number"
                  size="large"
                  placeholder="Enter Number"
                ></Input>
              </Form.Item>
              {/* ========================= category ===================== */}
              <Form.Item
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please enter Category",
                  },
                ]}
                style={{ width: "100%" }}
              >
                  <Select
        showSearch
        style={{ width: "100%" }}
        placeholder="Search to Select"
        optionFilterProp="label"
        onSearch={handleSearch} 
        filterOption={false} 
        options={data?.data?.map((therapist) => ({
          value: therapist._id,
          label: therapist.title,
        }))}
      />
              </Form.Item>
              <div className="flex justify-end">
                <Button onClick={()=>setCategoryOpen(true)}>Add New Category</Button>
              </div>
              {/*  =========================Input: About author======================== */}

              <Form.Item
                label="Author"
                name="author"
                rules={[{ type: "text", required: true }]}
              >
                <Input size="large" placeholder="Enter Author"></Input>
              </Form.Item>
              {/* =====================duration============ */}
              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ type: "text", required: true }]}
              >
                <Input size="large" placeholder=" Enter Duration"></Input>
              </Form.Item>
            </div>
            <div className="flex-1">
              {/* =====================episode link============ */}
              <Form.Item
                label="Episode Link"
                name="fileLink"
                rules={[
                  {
                    required: true,
                    message: "Please enter episode link",
                  },
                  {
                    pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                    message: "Please enter a valid URL", 
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Paste Your Podcast link"
                ></Input>
              </Form.Item>
              {/* ===============================Input: Featured Image Upload================================ */}
              <h1 className="py-2 font-medium">Cover Image Upload</h1>
              <Form.Item
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  Array.isArray(e) ? e : e && e.fileList
                }
                rules={[{ required: true }]}
                style={{
                  textAlign: "center",
                  border: "2px dashed #B87CAE",
                  paddingBlock: "20px",
                  borderRadius: "10px",
                }}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </div>
          </div>
          <Button
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            style={{
              backgroundColor: "#A57EA5",
              color: "white",
            }}
          >
            {isLoading ? "Uploading.." : "Upload"}
          </Button>
        </Form>
      </div>
       <CreateCategoryModal open={categoryopen} setOpen={setCategoryOpen}/>
    </Modal>
  );
};

export default AddpodCast;
