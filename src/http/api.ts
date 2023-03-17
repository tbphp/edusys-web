import http from './index'

type IdType = string | number

type LoginData = {
	identity: 1 | 2
	username: string
	password: string
}

type RegisterData = {
	name: string
	username: string
	password: string
}

type SchoolData = {
	name: string
}

type InviteTeacherData = {
	username: string
}

type StudentData = {
	name: string
}

type MessageData = {
	identity: 1 | 2
	user_id: number
	message: string
}

type ListQuery = {
	page: number
	per_page: number
}

/**
 * 基础接口
 */
export const AppServer = {
	// 登录
	login(data: LoginData) {
		return http.post('/login', data)
	}
}

/**
 * 教师接口
 */
export const TeacherServer = {
	// 教师注册
	register(data: RegisterData) {
		return http.post('/teacher/register', data)
	},

	// 学校列表
	getSchools(params: ListQuery) {
		return http.get('/teacher/schools', { params })
	},

	// 创建学校
	addSchool(data: SchoolData) {
		return http.post('/teacher/schools', data)
	},

	// 学校详情
	getSchoolDetail(id: IdType) {
		return http.get(`/teacher/schools/${id}`)
	},

	// 修改学校
	editSchool(id: IdType, data: SchoolData) {
		return http.put(`/teacher/schools/${id}`, data)
	},

	// 删除学校
	deleteSchool(id: IdType) {
		return http.delete(`/teacher/schools/${id}`)
	},

	// 学校老师列表
	getTeachersOfSchool(id: IdType, params: ListQuery) {
		return http.get(`/teacher/schools/${id}/teachers`, { params })
	},

	// 邀请老师
	inviteTeacher(id: IdType, data: InviteTeacherData) {
		return http.post(`/teacher/schools/${id}/teachers`, data)
	},

	// 移除老师
	removeTeacher(id: IdType) {
		return http.delete(`/teacher/schools/{school_id}/teachers/${id}`)
	},

	// 学生列表
	getStudents(id: IdType, params: ListQuery) {
		return http.get(`/teacher/schools/${id}/students`, { params })
	},

	// 添加学生
	addStudent(id: IdType) {
		return http.post(`/teacher/schools/${id}/students`)
	},

	// 修改学生
	editStudent(id: IdType, data: StudentData) {
		return http.post(`/teacher/schools/${id}/students/{student_id}`, data)
	},

	// 删除学生
	deleteStudent(schoolId: IdType, studentId: IdType) {
		return http.delete(`/teacher/schools/${schoolId}/students/${studentId}`)
	},

	// 重置学生密码
	resetPasswordOfStudent(schoolId: IdType, studentId: IdType) {
		return http.put(`/teacher/schools/${schoolId}/students/${studentId}/reset_password`)
	},

	// 粉丝列表
	getFans(params: ListQuery) {
		return http.get('/teacher/fans', { params })
	},

	// 粉丝数量
	getFansCount() {
		return http.get('/teacher/fans/count')
	},

	// 发送消息
	sendMessages(data: MessageData) {
		return http.post('/teacher/messages', data)
	}
}

/**
 * 学生接口
 */
export const StudentServer = {
	// 学校详情
	getSchoolDetail() {
		return http.get('/student/school')
	},

	// 老师列表
	getTeachers(params: ListQuery) {
		return http.get('/student/teachers', { params })
	},

	// 关注老师
	followTeacher(id: IdType) {
		return http.put(`/student/teachers/${id}/follow`)
	},

	// 取关老师
	unfollowTeacher(id: IdType) {
		return http.put(`/student/teachers/${id}/unfollow`)
	},

	// 发送消息
	sendMessages(data: MessageData) {
		return http.post('/student/messages', data)
	}
}
