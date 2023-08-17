import { Input, Button, FormLabel, FormErrorMessage, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Grid, GridItem, FormControl } from '@chakra-ui/react'
import { GoPersonAdd } from "react-icons/go";
import PhoneInput from 'react-phone-input-2';
import { Field, Form, Formik } from 'formik';

import 'react-phone-input-2/lib/style.css';

type Props = {}

const AddContactModal = (props: Props) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const validateFirstName = (value: string) => {
        let error: string | undefined;

        if (!value) {
            error = 'First name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
            error = 'Only letters are allowed';
        } else if (value.length < 3 || value.length > 20) {
            error = 'First name must be between 3 and 20 characters';
        }
        return error;
    };

    const validateLastName = (value: string) => {
        let error: string | undefined;

        if (!value) {
            error = 'Last name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
            error = 'Only letters are allowed';
        } else if (value.length < 3 || value.length > 20) {
            error = 'Last name must be between 3 and 20 characters';
        }
        return error;
    };

    const validatePhone = (value: string) => {
        let error: string | undefined;

        if (!value) {
            error = 'Phone number is required';
        } else if (!/^[0-9]+$/.test(value)) {
            error = 'Only letters are allowed';
        } else if (value.length < 7 || value.length > 20) {
            error = 'Number must be between 7 and 20 digits';
        }
        return error;
    };

    return (
        <div>
            <Button onClick={onOpen} size={'sm'} ml={'3'} leftIcon={<GoPersonAdd />} colorScheme='whatsapp' variant='solid'>Add contact</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a contact</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={{ first_name: '', last_name: '', phoneNumber: '' }}
                            onSubmit={(values) => {
                                // Handle form submission
                                console.log(values);
                            }}
                        >
                            {(props) => (
                                <Form>
                                    <Grid templateColumns='repeat(2, 1fr)' gap={4} mb={3}>
                                        <GridItem>
                                            <Field name='first_name' validate={validateFirstName}>
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.first_name && form.touched.first_name} isRequired>
                                                        <FormLabel>First name</FormLabel>
                                                        <Input {...field} placeholder='John' isRequired={true} />
                                                        <FormErrorMessage>{form.errors.first_name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </GridItem>
                                        <GridItem>
                                            <Field name='last_name' validate={validateLastName}>
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.last_name && form.touched.last_name} isRequired>
                                                        <FormLabel>Last name</FormLabel>
                                                        <Input {...field} placeholder='John' isRequired={true} />
                                                        <FormErrorMessage>{form.errors.last_name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </GridItem>
                                    </Grid>

                                    <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                                        <GridItem colSpan={5}>
                                            <Field name='phoneNumber' validate={validatePhone}>
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.phoneNumber && form.touched.phoneNumber} isRequired>
                                                        <FormLabel>Phone number</FormLabel>
                                                        <PhoneInput
                                                            {...field}
                                                            country="in"
                                                            placeholder="Enter phone number"
                                                            inputStyle={{
                                                                width: '100%',
                                                                borderRadius: '0.375rem',
                                                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                                            }}
                                                            countryCodeEditable={false}
                                                            inputProps={{
                                                                autoComplete: 'tel',
                                                                name: 'phoneNumber',
                                                                as: <Input />
                                                            }}
                                                            containerStyle={{ marginTop: '3.5px' }}
                                                            onBlur={() => form.setFieldTouched('phoneNumber', true)}
                                                            onChange={(phoneNumber) =>
                                                                form.setFieldValue('phoneNumber', phoneNumber)
                                                            }
                                                        />
                                                        <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </GridItem>

                                    </Grid>
                                    <Button type='submit' colorScheme='blue' mt={5}>
                                        Save
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AddContactModal