import { Input, Button, useToast, FormLabel, FormErrorMessage, Heading, Spacer, IconButton, Grid, HStack, GridItem, FormControl, Center, Card, CardBody, Flex } from '@chakra-ui/react'
import { GoArrowLeft, GoX, GoCheck, GoPlus } from "react-icons/go";
import PhoneInput from 'react-phone-input-2';
import { Field, Form, Formik, FieldArray } from 'formik';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import 'react-phone-input-2/lib/style.css';

// Config files
import client from '../config/apolloClient';
import { AddContactWithPhones, GetContactList } from '../config/queries';
import { Contact } from '../config/types';

// Util files
import { validateInput, validatePhoneNumber } from '../utils/validationUtils';
import { css } from '@emotion/react';

type Props = {}

const AddContact = (props: Props) => {

    // Chakra UI toast
    const toast = useToast();

    // Initial values for the Formik 
    const initialValues = {
        first_name: '',
        last_name: '',
        phoneNumbers: [''],
    };

    const [insertContact, { loading }] = useMutation(AddContactWithPhones); // Mutation for inserting a contact

    // Validation from utils
    const validateFirstName = (value: string) => validateInput(value, 'First name'); // Validate first name
    const validateLastName = (value: string) => validateInput(value, 'Last name'); // Validate last name
    const validatePhone = (value: any) => validatePhoneNumber(value, 'Phone number'); // Validate phone number

    const secondaryText = css`
    font-family: 'Nunito', sans-serif;
    `

    const primaryText = css`
        font-family: 'Roboto', sans-serif;
    `

    const buttonStyle = css`
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        &:hover {
            box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
        }
    `

    return (
        <div>
            <Heading mb={10} mt={10} textAlign={'center'}>Add Contact</Heading>
            <Center>
                <Card>
                    <CardBody>
                        <Formik
                            initialValues={{ first_name: '', last_name: '', phoneNumbers: [''] }}
                            onSubmit={async (values, { resetForm }) => {
                                try {

                                    // Check if the first_name already exists
                                    const { data: existingContactData } = await client.query<{ contact: Contact[] }>({
                                        query: GetContactList,
                                    });

                                    const existingContact = existingContactData.contact.find(contact => contact.first_name === values.first_name);

                                    if (existingContact) {
                                        // Toast for duplicate first name
                                        toast({
                                            title: 'Duplicate First Name',
                                            description: 'A contact with the same first name already exists.',
                                            status: 'warning',
                                            position: 'top',
                                            duration: 3500,
                                            isClosable: true,
                                        });

                                        return; // Exit the function to prevent insertion
                                    }

                                    // Query to insert contact
                                    const { data } = await insertContact({
                                        variables: {
                                            first_name: values.first_name,
                                            last_name: values.last_name,
                                            phones: values.phoneNumbers.map(number => ({ number }))
                                        }
                                    });

                                    // Show toast for successful contact addition
                                    toast({
                                        title: 'Contact Added',
                                        description: 'Contact has been successfully added.',
                                        status: 'success',
                                        position: 'top',
                                        duration: 3500,
                                        isClosable: true,
                                    });

                                    resetForm({ values: initialValues });

                                    // console.log('Inserted contact:', data.insert_contact.returning);

                                } catch (error) {

                                    // Show toast for unsuccessful contact addition
                                    toast({
                                        title: 'Error occurred',
                                        description: `${error}`,
                                        status: 'error',
                                        position: 'top',
                                        duration: 4000,
                                        isClosable: true,
                                    });
                                    console.error('Error inserting contact:', error);
                                }
                            }}
                        >
                            {({ values, handleSubmit, setFieldValue }) => (
                                <Form>
                                    <Grid templateColumns='repeat(2, 1fr)' gap={4} mb={3}>
                                        <GridItem>

                                            {/* First name input */}
                                            <Field name='first_name' validate={validateFirstName}>
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.first_name && form.touched.first_name} isRequired>
                                                        <FormLabel css={primaryText}>First name</FormLabel>
                                                        <Input {...field} placeholder='John' isRequired={true} />
                                                        <FormErrorMessage>{form.errors.first_name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </GridItem>
                                        <GridItem>

                                            {/* Last name input */}
                                            <Field name='last_name' validate={validateLastName}>
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.last_name && form.touched.last_name} isRequired>
                                                        <FormLabel css={primaryText}>Last name</FormLabel>
                                                        <Input {...field} placeholder='John' isRequired={true} />
                                                        <FormErrorMessage>{form.errors.last_name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </GridItem>
                                    </Grid>

                                    <Grid templateColumns='repeat(5, 2fr)' gap={4}>
                                        <FieldArray name="phoneNumbers">
                                            {({ push, remove }: any) => (
                                                <GridItem colSpan={4}>

                                                    {/* Phone number input */}
                                                    <FormLabel css={primaryText}>Phone number</FormLabel>
                                                    {values.phoneNumbers.map((phoneNumber: any, index: any) => (
                                                        <div key={index}>
                                                            <Field
                                                                name={`phoneNumbers.${index}`}
                                                                validate={validatePhone}
                                                            >
                                                                {({ field, form }: any) => (
                                                                    <FormControl
                                                                        isInvalid={
                                                                            form.errors.phoneNumbers?.[index] &&
                                                                            form.touched.phoneNumbers?.[index]
                                                                        }
                                                                        isRequired
                                                                    >
                                                                        <HStack>
                                                                            <PhoneInput
                                                                                {...field}
                                                                                country="in"
                                                                                placeholder="Enter phone number"
                                                                                countryCodeEditable={false}
                                                                                inputStyle={{
                                                                                    height: '2.5rem',
                                                                                    fontSize: '1rem',
                                                                                    borderRadius: '0.375rem',
                                                                                    borderColor: 'inherit',
                                                                                    background: 'inherit'
                                                                                }}
                                                                                containerStyle={{ marginTop: '3.5px' }}
                                                                                onBlur={() => form.setFieldTouched(`phoneNumbers.${index}`, true)}
                                                                                onChange={(phoneNumber) =>
                                                                                    form.setFieldValue(`phoneNumbers.${index}`, phoneNumber)
                                                                                }
                                                                            />
                                                                            {index > 0 && (
                                                                                // Button to remove extra phone input field
                                                                                <IconButton
                                                                                    css={buttonStyle}
                                                                                    colorScheme="red"
                                                                                    aria-label='Remove number'
                                                                                    icon={<GoX />}
                                                                                    size="xs"
                                                                                    onClick={() => remove(index)}
                                                                                />
                                                                            )}
                                                                        </HStack>
                                                                        <FormErrorMessage>
                                                                            {form.errors.phoneNumbers?.[index]}
                                                                        </FormErrorMessage>
                                                                    </FormControl>
                                                                )}
                                                            </Field>

                                                        </div>
                                                    ))}

                                                    {/* Button to add a extra phone input field */}
                                                    <Button
                                                        css={buttonStyle}
                                                        mt={3}
                                                        leftIcon={<GoPlus />}
                                                        colorScheme="green"
                                                        size="xs"
                                                        onClick={() => push('')}
                                                    >
                                                        Add another number
                                                    </Button>
                                                </GridItem>
                                            )}
                                        </FieldArray>

                                    </Grid>
                                    <Flex mt={10}>
                                        <Link to='/'>
                                            <Button css={buttonStyle} leftIcon={<GoArrowLeft />} colorScheme='red' variant='ghost'>
                                                Contact list
                                            </Button>
                                        </Link>
                                        <Spacer />
                                        <Button css={buttonStyle} isLoading={loading} leftIcon={<GoCheck />} type='submit' colorScheme='whatsapp' >
                                            Add
                                        </Button>
                                    </Flex>
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Center>
        </div>
    )
}

export default AddContact