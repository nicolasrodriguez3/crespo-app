import { useFormik } from "formik"
import { useState } from "react"
import * as Yup from "yup"
import {
  Button,
  Input,
  Badge,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@nextui-org/react"
import { useAuth } from "../hooks/useAuth"
import editIcon from "../assets/pen-linear.svg"
import arrowIcon from "../assets/alt-arrow-right-linear.svg"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { getProfileImage } from "../helpers/getProfileImage"

const getSex = (sexSelected) => {
  switch (sexSelected) {
    case "male":
      return "Masculino"
    case "female":
      return "Femenino"
    default:
      return "Otro"
  }
}

export function EditProfile() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { user, saveUserImg } = useAuth()
  const storage = getStorage()

  const [error, setError] = useState(null)

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      sex: "",
      birthDate: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Ingrese su nombre."),
      surname: Yup.string().required("Ingrese su apellido."),
      birthDate: Yup.string().required("Ingrese su fecha de nacimiento."),
      sex: Yup.string().required("Ingrese su sexo."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      setSubmitting(false)

      console.log(values)
    },
  })

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    touched,
    errors,
    isSubmitting,
  } = formik

  const handleDownloadAvatar = async () => {
    const imageUrl = await getProfileImage(user.uid)
    saveUserImg(imageUrl)
  }

  const handleUploadAvatar = (e) => {
    const storageRef = ref(storage, `avatars/${user.uid}`)
    const file = e.target.files[0]

    try {
      uploadBytes(storageRef, file)
      //setAvatarUrl(URL.createObjectURL(file))
      handleDownloadAvatar()
    } catch (error) {
      throw new Error("Error actualizando la imagen")
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <div className="-mb-10 flex min-h-[200px] w-full items-center justify-center bg-gradient-to-b from-[#f5c400] to-gold p-4 pb-10">
        <Badge
          isOneChar
          role="button"
          className="h-10 w-10 text-large"
          content={
            <label
              role="button"
              className="flex h-full w-full items-center justify-center"
            >
              <input
                type="file"
                name="avatar"
                id="avatar"
                className="hidden"
                onChange={handleUploadAvatar}
              />
              <img
                src={editIcon}
                width={24}
              />
            </label>
          }
          color="warning"
          shape="circle"
          placement="top-right"
        >
          <Avatar
            radius="full"
            className="h-20 w-20 rounded-full text-large"
            src={user.photoURL || "/chicken.svg"}
            name={user?.name}
          />
        </Badge>
      </div>
      <section className="z-10 flex w-full grow flex-col items-center gap-8 rounded-t-3xl bg-gray-50 py-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-xs flex-col gap-4"
        >
          <Input
            name="name"
            value={values.name}
            id="name"
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            label="Nombre"
            variant="underlined"
            autoComplete="true"
            validationState={touched.name && errors.name ? "invalid" : "valid"}
            errorMessage={touched.name && errors.name ? errors.name : ""}
          />

          <Input
            type="text"
            label="Apellido"
            name="surname"
            value={values.surname}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            labelPlacement="inside"
            variant="underlined"
            validationState={
              touched.surname && errors.surname ? "invalid" : "valid"
            }
            errorMessage={
              touched.surname && errors.surname ? errors.surname : ""
            }
          />

          <Input
            type="email"
            label="Correo"
            name="email"
            value={values.email}
            onChange={handleChange}
            isDisabled
            labelPlacement="inside"
            variant="underlined"
          />

          <Input
            type="date"
            label="Fecha de nacimiento"
            name="birthDate"
            placeholder="dd/mm/aaaa"
            value={values.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            labelPlacement="inside"
            variant="underlined"
            validationState={
              touched.birthDate && errors.birthDate ? "invalid" : "valid"
            }
            errorMessage={
              touched.birthDate && errors.birthDate ? errors.birthDate : ""
            }
          />
          
          <div>
          <Button
            onPress={onOpen}
            variant="light"
            color={errors.sex ? "danger" : "default"}
            className="p-1 w-full"
            endContent={
              <img
                src={arrowIcon}
                alt="Salir"
                width={24}
              />
            }
          >
            <div className="grow text-left flex flex-col">
              <span className="text-xs text-foreground-500">{values.sex && "Sexo"}</span>
              <span className="pl-1">{values.sex ? getSex(values.sex) : "Sexo"}</span>
            </div>
          </Button>
          <div className="text-tiny text-danger">{errors.sex}</div>
</div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
          >
            <ModalContent className="pb-4">
              {(onClose) => (
                <>
                  <ModalHeader>Sexo</ModalHeader>
                  <ModalBody>
                    <RadioGroup
                      value={values.sex}
                      name="sex"
                      onChange={handleChange}
                      onValueChange={onClose}
                    >
                      <Radio value="male">Masculino</Radio>
                      <Radio value="female">Femenino</Radio>
                      <Radio value="other">Otro</Radio>
                    </RadioGroup>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>

          {error && <p className="text-red-400">{error}</p>}
          <Button
            type="submit"
            className="bg-gold"
            isLoading={isSubmitting}
            spinner={
              <svg
                className="h-5 w-5 animate-spin text-current"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            Guardar datos
          </Button>
        </form>
      </section>
    </main>
  )
}
