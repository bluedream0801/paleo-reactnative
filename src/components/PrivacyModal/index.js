import React from 'react'
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native'
import styles from './Styles'
import { appImages } from '../../theme'
const PrivacyModal = (props) => {
  return (
    <Modal
      visible={props.showPrivacyModal}
      onRequestClose={() => props.setShowPrivacyModal()}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.topView}>
            <Text style={styles.topText}>Privacy Policy</Text>
          </View>
          <TouchableOpacity
            style={styles.crossBtn}
            onPress={() => props.setShowPrivacyModal()}
          >
            <Image
              source={appImages.close}
              style={styles.crossImg}
              resizeMode={'contain'}
            />
          </TouchableOpacity>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.content}>
              This is the privacy notice of Paleo Robbie. In this document, “we”
              or “us” refers to Paleo Robbie registered in Thailand. {`\n`}
              {`\n`}
              Our registered office is 55 Thong Lor, Klongtan Nua, Watthana,
              Bangkok, 10110 , Thailand. {`\n`}
              {`\n`}
              This is a notice to tell you our policy about all information that
              we record about you. It covers both information that could and
              could not identify you and information. {`\n`}
              {`\n`}
              We are extremely concerned to protect your privacy and
              confidentiality. We understand that all users of our web site are
              quite rightly concerned to know that their data will not be used
              for any purpose unintended by them, and will not accidentally fall
              into the hands of a third party. Our policy is both specific and
              strict. It complies with Thailand law [and with the laws of all
              jurisdictions of which we are aware. If you think our policy falls
              short of your expectations or that we are failing to abide by our
              policy, do please tell us. {`\n`}
              {`\n`}
              We regret that if there are one or more points below with which
              you are not happy, your only recourse is to leave our web site
              immediately. {`\n`}
              {`\n`}
              Except as set out below, we do not share, or sell, or disclose to
              a third party, any personally identifiable information collected
              at this site or Facebook. {`\n`}
              {`\n`}
              Here is a list of the information we collect from you, either
              through our web site or because you give it to us in some other
              way, and why it is necessary to collect it: {`\n`}
              {`\n`}
              1. Business and personal information {`\n`}
              {`\n`}
              This includes basic identification and contact information, such
              as your name and contact details and also includes all information
              given to us in the course of your business and ours, such as
              information you give us in your capacity as our client. We
              undertake to preserve the confidentiality of the information and
              of the terms of our relationship. It is not used for any other
              purpose. We expect you to reciprocate this policy. This
              information is used: {`\n`}
              {`\n`}
              1.1. to provide you with the services which you request; {`\n`}
              {`\n`}
              1.2. for verifying your identity for security purposes; {`\n`}
              {`\n`}
              1.3. for marketing our services and products; {`\n`}
              {`\n`}
              1.4. information which does not identify any individual may be
              used in a general way by us or third parties, to provide class
              information, for example relating to demographics or usage of a
              particular page or service. {`\n`}
              {`\n`}
              We keep information, which forms part of our business record for a
              minimum of six years. That is because we may need it in some way
              to support a claim or defence in court. That is also the period
              within which our tax collecting authorities may demand to know it.{' '}
              {`\n`}
              {`\n`}
              2. Your domain name and e-mail address {`\n`}
              {`\n`}
              This information is recognised by our servers and the pages that
              you visit are recorded. We shall not under any circumstances,
              divulge your e-mail address to any person who is not an employee
              or contractor of ours and who does not need to know, either
              generally or specifically. This information is used: {`\n`}
              {`\n`}
              2.1. to correspond with you or deal with you as you expect; {`\n`}
              {`\n`}
              2.2. in a collective way not referable to any particular
              individual, for the purpose of quality control and improvement of
              our site; {`\n`}
              {`\n`}
              2.3. to send you news about the services to which you have signed
              up; {`\n`}
              {`\n`}
              2.4. to tell you about other of our services or services of sister
              web sites. {`\n`}
              {`\n`}
              3.Information you post on our website {`\n`}
              {`\n`}
              Information you send to us by posting to a forum or blog or in
              your advertisement is stored on our servers. We do not
              specifically use that information except to allow it to be read,
              but you will see in our terms and conditions that we reserve a
              right to use it in any way we decide. {`\n`}
              {`\n`}
              4. Website usage information {`\n`}
              {`\n`}
              We may use software embedded in our website (such as JavaScript)
              to collect information about pages you view and how you have
              reached them, what you do when you visit a page, the length of
              time you remain on the page, and how we perform in providing
              content to you. {`\n`}
              {`\n`}
              5. Financial information relating to your credit cards {`\n`}
              {`\n`}
              This information is never taken by us either through our website
              or otherwise. At the point of payment, you are transferred to a
              secure page on the website of Stripe or some other reputable
              payment service provider. That page may be dressed in our
              “livery”, but it is not controlled by us. Our staff and
              contractors never have access to it. {`\n`}
              {`\n`}
              6. Note on padlock symbols and other trust marks {`\n`}
              {`\n`}
              Many companies offer certification and an icon or other small
              graphic to prove to site visitors that the site is safe. Some
              certify to a high level of safety. Others are more concerned to
              take our money than to provide a useful service. We do not handle
              information about your credit card so do not subscribe to any such
              service. {`\n`}
              {`\n`}
              7. Financial information relating to your credit cards {`\n`}
              {`\n`}
              We may keep your financial information to provide you with a
              better shopping experience next time you visit us and to prevent
              fraud. {`\n`}
              {`\n`}
              8. Credit reference {`\n`}
              {`\n`}
              To assist in combating fraud, we share information with credit
              reference agencies, so far as it relates to clients or customers
              who instruct their credit card issuer to cancel payment to us
              without having first provided an acceptable reason to us and given
              us the opportunity to refund their money. {`\n`}
              {`\n`}
              9. Third party advertising {`\n`}
              {`\n`}
              Third parties may advertise on our web site. In doing so, those
              parties, their agents or other companies working for them may use
              technology that automatically collects your IP address when they
              send an advertisement that appears on our site to your browser.
              They may also use other technology such as cookies or JavaScript
              to personalise the content of, and to measure the performance of
              their adverts. We do not have control over these technologies or
              the data that these parties obtain. Accordingly, this privacy
              notice does not cover the information practices of these third
              parties. {`\n`}
              {`\n`}
              10. Third party content {`\n`}
              {`\n`}
              Our web site is a publishing medium in that anyone may register
              and then publish information about himself or some other person.
              We do not moderate or control what is posted. If you complain
              about any of the content on our web site, we shall investigate
              your complaint. If we feel, it may be justified, we shall remove
              it while we investigate. Free speech is a fundamental right, so we
              have to make a judgment as to whose right will be obstructed:
              yours, or that of the person who posted the content which offends
              you. If we think, your complaint is vexatious or without any
              basis, we shall not correspond with you about it. {`\n`}
              {`\n`}
              11. Information we obtain from third parties {`\n`}
              {`\n`}
              Although we do not disclose your personal information to any third
              party (except as set out in this notice), we do receive data which
              is indirectly made up from your personal information, from
              software services such as Google Analytics and others. No such
              information is identifiable to you. 12. Content you provide to us
              with a view to be used by third party If you provide information
              to us with a view to it being read, copied, downloaded or used by
              other people, we accept no responsibility for what that third
              party may do with it. It is up to you to satisfy yourself about
              the privacy level of every person who might see your information.
              If it is available to all the World, you have no control whatever
              as to how it is used. 13. Cookies Cookies are small text files
              that are placed on your computer’s hard drive through your web
              browser when you visit any web site. They are widely used to make
              web sites work, or work more efficiently, as well as to provide
              information to the owners of the site. Like all other users of
              cookies, we may request the return of information from your
              computer when your browser requests a web page from our server.
              Cookies enable our web server to identify you to us, and to track
              your actions and the pages you visit while you use our website.
              The cookies we use may last for a single visit to our site (they
              are deleted from your computer when you close your browser), or
              may remain on your computer until you delete them or until a
              defined period of time has passed. Although your browser software
              enables you to disable cookies, we recommend that you allow the
              use of cookies in order to take advantage of the features of our
              website that rely on their use. If you prevent their use, you will
              not be able to use all the functionality of our website. Here are
              the ways we use cookies: 13.1. to record whether you have accepted
              the use of cookies on our web site. This is solely to comply with
              the law. If you have chosen not to accept cookies, we will not use
              cookies for your visit, but unfortunately, our site will not work
              well for you; 13.2. to allow essential parts of our web site to
              operate for you; 13.3. to operate our content management system;
              13.4. to operate the online notification form – the form that you
              use to contact us for any reason. This cookie is set on your
              arrival at our web site and deleted when you close your browser;{' '}
              {`\n`}
              {`\n`}
              13.5. to enhance security on our contact form. It is set for use
              only through the contact form. This cookie is deleted when you
              close your browser; {`\n`}
              {`\n`}
              13.6. to collect information about how visitors use our site. We
              use the information to improve your experience of our site and
              enable us to increase sales. This cookie collects information in
              an anonymous form, including the number of visitors to the site,
              where visitors have come to the site from, and the pages they
              visited; {`\n`}
              {`\n`}
              13.7. to record that a user has viewed a webcast. It collects
              information in an anonymous form. This cookie expires when you
              close your browser; {`\n`}
              {`\n`}
              13.8. to record your activity during a web cast. An example is as
              to whether you have asked a question or provided an opinion by
              ticking a box. This information is retained so that we can serve
              your information to you when you return to the site. This cookie
              will record an anonymous ID for each user, but it will not use the
              information for any other purpose. This cookie will last for
              [three] months, when it will delete automatically; {`\n`}
              {`\n`}
              13.9. to store your personal information so that you do not have
              to provide it afresh when you visit the site next time. This
              cookie will last for [90] days; {`\n`}
              {`\n`}
              13.10. to enable you to watch videos we have placed on YouTube.
              YouTube will not store personally identifiable cookie information
              when you use YouTube’s privacy-enhanced mode. {`\n`}
              {`\n`}
              14. Sending a message to our support system {`\n`}
              {`\n`}
              When you send a message, we collect the data you have given to us
              in that message in order to obtain confirmation that you are
              entitled to receive the information and to provide to you the
              information you need. We record your request and our reply in
              order to increase the efficiency of our business / organisation.
              We do not keep any personally identifiable information associated
              with your message, such as your name or email address. {`\n`}
              {`\n`}
              15. Complaining {`\n`}
              {`\n`}
              When we receive a complaint, we record all the information you
              have given to us. We use that information to resolve your
              complaint. If your complaint reasonably requires us to contact
              some other person, we may decide to give to that other person some
              of the information contained in your complaint. We do this as
              infrequently as possible, but it is a matter for our sole
              discretion as to whether we do give information, and, if we do,
              what that information is. {`\n`}
              {`\n`}
              We may also compile statistics showing information obtained from
              this source to assess the level of service we provide, but not in
              a way that could identify you or any other person. {`\n`}
              {`\n`}
              16. Job application and employment {`\n`}
              {`\n`}
              If you send us information in connection with a job application,
              we may keep it for up to three years in case we decide to contact
              you at a later date. If we employ you, we collect information
              about you and your work from time to time throughout the period of
              your employment. This information will be used only for purposes
              directly relevant to your employment. After your employment has
              ended, we will keep your file for six years before destroying or
              deleting it. {`\n`}
              {`\n`}
              17. Marketing information {`\n`}
              {`\n`}
              We do not share your personal information with anyone or
              third-party sources. {`\n`}
              {`\n`}
              18. Re-marketing {`\n`}
              {`\n`}
              We may use re-marketing from time to time. This involves Google,
              Facebook or some other supplier placing a tag or marker on your
              website in order to be able to serve to you an advert for our
              products / services when you visit some other website. {`\n`}
              {`\n`}
              19. Use of site by children {`\n`}
              {`\n`}
              Certain areas of our website are designed for use by children over
              7 years of age. These areas include membership content and are
              designed for children. We collect data about all users of and
              visitors to these areas regardless of age, and we anticipate that
              some of those users and visitors will be children. {`\n`}
              {`\n`}
              Such child users and visitors will inevitably visit other parts of
              the site and will be subject to whatever on-site marketing they
              find, wherever they visit. {`\n`}
              {`\n`}
              20. Disclosure to Government and their agencies {`\n`}
              {`\n`}
              We are subject to the law like everyone else. We may be required
              to give information to legal authorities if they so request or if
              they have the proper authorisation such as a search warrant or
              court order. {`\n`}
              {`\n`}
              21. Compliance with the law {`\n`}
              {`\n`}
              This confidentiality policy has been compiled so as to comply with
              the law of every jurisdiction in which we aim to do business. If
              you think it fails to satisfy the law of your country, we should
              like to hear from you, but ultimately it is your choice as to
              whether you wish to use our website. {`\n`}
              {`\n`}
              22. Review or update personally identifiable information {`\n`}
              {`\n`}
              At any time you may review or update the personally identifiable
              information that we hold about you, by contacting us at the
              address below. To better safeguard your information, we will also
              take reasonable steps to verify your identity before granting
              access or making corrections to your information. {`\n`}
              {`\n`}
              23. Removal of your information {`\n`}
              {`\n`}
              If you wish us to remove personally identifiable information from
              our web site, you may contact us at cx@PaleoRobbie.com. To better
              safeguard your information, we will also take reasonable steps to
              verify your identity before granting access or making corrections
              to your information. {`\n`}
              {`\n`}
              24. Data may be “processed” outside Thailand {`\n`}
              {`\n`}
              Our web sites are hosted in the USA. We also use outsourced
              services in countries outside Thailand from time to time in other
              aspects of our business. Accordingly data obtained within Thailand
              may be “processed” outside Thailand and data obtained in any other
              country may be processed within or outside that country. {`\n`}
              {`\n`}
              25. How you can contact us {`\n`}
              {`\n`}
              Emailing: cx@PaleoRobbie.com {`\n`}
              {`\n`}
              26. Change in Privacy Policy {`\n`}
              {`\n`}
              As we plan to ensure our privacy policy remains current, this
              policy is subject to change. Please return periodically to review
              our privacy policy. {`\n`}
              {`\n`}
              If you have any question regarding the privacy policy, please
              contact us through the contact page. {`\n`}
              {`\n`}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default PrivacyModal
