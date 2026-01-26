<template>
  <div class="min-h-screen text-white p-10 flex justify-center text-center items-center flex-col">

    <!-- Teacher: add assignment -->
    <div v-if="user && user.role === 'teacher'" class="md:max-w-3xl mx-auto md:mt-20 mt-15 mb-6 md:mb-6 bg-gray-800 p-4 md:p-4 rounded-xl flex justify-center items-center flex-col">
      <h3 class="font-semibold mb-2">เพิ่มงานใหม่</h3>
      <div class="flex flex-col gap-2">
        <input v-model="selectedTeacherName" placeholder="ชื่อครูผู้สอน" class="p-2 rounded bg-gray-700" />
        <input v-model="newTitle" placeholder="ชื่อเรื่อง" class="flex-1 p-2 rounded bg-gray-700" />
        <input v-model="newDue" type="date" class="p-2 rounded bg-gray-700" placeholder="วันที่"/>
        <button @click="addAssignment" class="bg-green-600 px-4 rounded">เพิ่ม</button>
      </div>
    </div>

    <!-- Parent: pick student -->
    <div v-if="user && user.role === 'parent'" class="max-w-3xl mx-auto mt-20">
      <label class="text-gray-400 text-sm">เลือกนักเรียน:</label>
      <select v-model="selectedStudentId" class="ml-2 bg-gray-800 p-2 rounded">
        <option v-for="s in students" :key="s.id" :value="s.id">{{ s.username }}</option>
      </select>
    </div>

    <div class="flex flex-row justify-center gap-6 flex-wrap mt-20">
      <div v-for="(a, idx) in assignments" :key="a.id" class="bg-gray-800 p-4 rounded-xl flex flex-row justify-center flex-wrap">
        <!-- changed: compact teacher list + show not-submitted count -->
        <div v-if="user && user.role === 'teacher'" class="flex justify-between items-center">
          <div class="text-left">
            <h3 class="text-lg font-semibold flex items-center">
              <span>{{ a.title }}</span>
              <!-- badge: count of not-submitted -->
              <span class="ml-3 text-xs bg-red-600 px-2 py-0.5 rounded-full font-medium">
                ยังไม่ส่ง {{ a.notSubmitted ? a.notSubmitted.length : 0 }}
              </span>
            </h3>
            <p class="text-xs text-gray-400">กำหนดส่ง: {{ a.due || 'ไม่กำหนด' }}</p>
            <p class="text-gray-400 text-sm">ครูผู้สอน: {{ a.teacher_name || a.teacher?.username || a.teacher_username || '-' }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" @click="openEdit(idx)" class="bg-yellow-600 px-3 py-1 rounded text-sm">แก้ไข</button>
            <button type="button" @click="deleteAssignment(idx)" class="bg-red-600 px-3 py-1 rounded text-sm">ลบ</button>
          </div>
        </div>
        <div v-else>
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold">{{ a.title }}</h2>
              <p class="text-gray-400 text-sm">กำหนดส่ง: {{ a.due || 'ไม่กำหนด' }}</p>
              <p class="text-gray-400 text-sm">ครูผู้สอน: {{ a.teacher_name || a.teacher?.username || a.teacher_username || '-' }}</p>
              <p class="text-gray-400 text-sm mt-1">{{ a.desc }}</p>
            </div>

            <div class="text-right space-y-2">
              <div v-if="user && user.role === 'teacher'">
                <button @click="deleteAssignment(idx)" class="bg-red-600 px-3 py-1 rounded">ลบ</button>
              </div>
              <div class="text-sm text-gray-300">
                <!-- show full count to teacher, otherwise show filtered count -->
                {{ (user.value && user.value.role === 'teacher') ? a.notSubmitted.length : visibleNotSubmitted(a).length }}
              </div>
            </div>
          </div>

          <div class="mt-4 flex gap-4">
            <!-- Students palette for dragging (teacher only) -->
            <div v-if="user && user.role === 'teacher'" class="w-1/3 bg-gray-900 p-3 rounded">
              <div class="text-sm text-gray-300 mb-2">ลากชื่อนักเรียนไปยังงานนี้หรือกดปุ่มเพื่อเพิ่มรายชื่อ</div>

              <!-- added: search + info + page controls -->
              <div class="mb-3 space-y-2">
                <input v-model="studentQuery" placeholder="ค้นหาชื่อนักเรียน..." class="w-full p-2 rounded bg-gray-800 text-sm" />
                <div class="flex justify-between text-xs text-gray-400">
                  <div>แสดง {{ displayedCount }} จาก {{ filteredCount }} นักเรียน</div>
                  <button type="button" @click="resetStudentView" class="text-sm text-gray-300">รีเซ็ต</button>
                </div>
              </div>

              <!-- make student list scrollable on mobile -->
              <div class="max-h-56 overflow-auto touch-auto">
                <div v-for="s in displayedStudents" :key="s.id" class="flex items-center justify-between p-2 mt-2 bg-gray-800 rounded">
                  <div class="flex-1 cursor-grab" draggable="true" @dragstart="onDragStart(s.id)">{{ s.username }}</div>
                  <button
                    type="button"
                    class="ml-2 bg-blue-600 px-2 py-1 rounded text-sm"
                    :disabled="a.notSubmitted && a.notSubmitted.map(x => String(x)).includes(String(s.id))"
                    @click="addStudentToAssignment(idx, s.id)"
                  >+</button>
                </div>
              </div>

              <div class="mt-2 flex justify-center">
                <button v-if="canLoadMore" type="button" @click="loadMoreStudents" class="bg-gray-700 px-3 py-1 rounded text-sm">โหลดเพิ่ม</button>
              </div>
            </div>

            <!-- Drop area and list of assigned/not submitted -->
            <div class="flex-1 bg-gray-900 p-3 rounded"
              @dragover.prevent
              @drop.prevent="onDrop(idx)">
              <div class="text-sm text-gray-300 mb-2">นักเรียนที่ยังไม่ได้ส่ง</div>
              <div v-if="(user.value && user.value.role === 'teacher') ? a.notSubmitted.length === 0 : visibleNotSubmitted(a).length === 0" class="text-gray-500">ไม่มี</div>
              <div v-for="stuId in (user.value && user.value.role === 'teacher' ? a.notSubmitted : visibleNotSubmitted(a))" :key="stuId" class="flex justify-between items-center mt-2 bg-gray-800 p-2 rounded">
                <div>{{ studentNameById(stuId) }}</div>
                <div class="flex gap-2">
                  <button v-if="(user && user.role === 'teacher')" @click="markSubmitted(idx, stuId)" class="bg-green-600 px-2 py-1 rounded text-sm">ทำเครื่องหมายส่งแล้ว</button>
                  <div v-else-if="isViewingStudent(stuId)" class="text-sm text-red-400 font-semibold">ยังไม่ส่ง</div>
                </div>
              </div>
            </div>

            <!-- For students/parents: quick status -->
            <div v-if="user && user.role !== 'teacher'" class="w-1/3 bg-gray-900 p-3 rounded">
              <div class="text-sm text-gray-300 mb-2">สถานะสำหรับ:
                <span class="font-semibold ml-1">
                  {{ viewingStudentName }}
                </span>
              </div>
              <div v-if="isStudentNotSubmitted(a, selectedStudentIdComputed)" class="text-red-400 font-semibold">ยังไม่ได้ส่ง</div>
              <div v-else class="text-green-400 font-semibold">ส่งแล้ว / ไม่มีข้อมูล</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit modal (in-page) -->
      <div v-if="editingIndex !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="w-full max-w-2xl bg-gray-900 p-4 rounded">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-semibold">แก้ไข: {{ assignments[editingIndex].title }}</h3>
            <button type="button" class="text-gray-300" @click="closeEdit">ปิด</button>
          </div>

          <div class="mb-3">
            <input v-model="studentQuery" placeholder="ค้นหาชื่อนักเรียน..." class="w-full p-2 rounded bg-gray-800 text-sm" />
          </div>

          <div class="max-h-72 overflow-auto mb-3">
            <div v-for="s in displayedStudents" :key="s.id" class="flex items-center justify-between p-2 mt-2 bg-gray-800 rounded">
              <div>{{ s.username }} <small class="text-xs text-gray-400 ml-2">{{ s.email || '' }}</small></div>
              <input type="checkbox" :value="s.id" :checked="editingSelected.includes(String(s.id))" @change="toggleStudentInEdit(s.id)" />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button type="button" class="bg-gray-700 px-3 py-1 rounded" @click="resetStudentView">รีเซ็ตมุมมอง</button>
            <button type="button" class="bg-green-600 px-4 py-1 rounded" @click="saveEdit">บันทึก</button>
          </div>
        </div>
      </div>

      <!-- กรณีไม่มีงาน -->
      <div v-if="assignments.length === 0" class="text-center text-gray-400 mt-10">
        ไม่มีงานค้าง 🎉
      </div>
    </div>

    <div class="max-w-3xl mx-auto mb-4" v-if="apiError">
      <div class="text-red-400 text-sm">{{ apiError }}</div>
    </div>

    <!-- debug info (temporary) -->
    <!-- <div class="max-w-3xl mx-auto mb-4 text-sm text-gray-400" v-if="debugInfo">
      <div>API base: {{ apiBase }}</div>
      <div>Token present: {{ tokenPresent }}</div>
      <div>Assignments fetched: {{ debugInfoCount }}</div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import auth from '../services/auth'
import api from '../services/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = auth.user
const selectedTeacherName = ref('')
const students = ref([])
const assignments = ref([])
const newTitle = ref('')
const newDue = ref('')
const newDesc = ref('')
const draggedStudent = ref(null)
const selectedStudentId = ref(null)
const apiError = ref('')
const debugInfo = ref(null)
const apiBase = api.baseUrl
const tokenPresent = ref(false)
const debugInfoCount = ref(0)

// added: search + pagination for students
const studentQuery = ref('')
const pageSize = 8
const visibleCount = ref(pageSize)

const filteredStudents = computed(() => {
  const q = (studentQuery.value || '').trim().toLowerCase()
  if (!q) return students.value
  return students.value.filter(s => {
    const name = (s.username || '').toLowerCase()
    const email = (s.email || '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })
})
const displayedStudents = computed(() => filteredStudents.value.slice(0, visibleCount.value))
const filteredCount = computed(() => filteredStudents.value.length)
const displayedCount = computed(() => displayedStudents.value.length)
const canLoadMore = computed(() => visibleCount.value < filteredCount.value)

function loadMoreStudents() {
  visibleCount.value = Math.min(filteredCount.value, visibleCount.value + pageSize)
}
function resetStudentView() {
  studentQuery.value = ''
  visibleCount.value = pageSize
}

// changed: normalize student ids to strings
async function loadStudents() {
  try {
    const res = await auth.getUsersByRole('student')
    const arr = Array.isArray(res) ? res : []
    students.value = arr.map(s => ({ ...s, id: String(s.id) }))
  } catch (e) {
    try {
      const res = await auth.getUsersByRole('student')
      const arr = Array.isArray(res) ? res : []
      students.value = arr.map(s => ({ ...s, id: String(s.id) }))
    } catch {
      students.value = []
    }
  }
  if (students.value.length && !selectedStudentId.value) selectedStudentId.value = students.value[0].id
}

// changed: load assignments with better error handling and error message exposure
async function loadAssignments() {
  apiError.value = ''
  debugInfo.value = null
  tokenPresent.value = !!localStorage.getItem('ast_token') // show if token exists
  if (api.baseUrl) {
    try {
      const res = await api.get('/assignments')
      // map and normalize
      assignments.value = Array.isArray(res) ? res.map(a => ({
        ...a,
        id: a.id,
        notSubmitted: Array.isArray(a.notSubmitted) ? a.notSubmitted.map(x => String(x)) : [],
        teacher: a.teacher_username ? { id: a.created_by || a.teacher_id, username: a.teacher_username } : (a.teacher || null)
      })) : []
      return
    } catch (e) {
      console.error('fetch /assignments error:', e)
      if (e && e.status && (e.status === 401 || e.status === 403)) {
        auth.logout()
        router.push({ name: 'Login' })
        return
      }
      apiError.value = (e && e.message) ? e.message : 'ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้'
      // continue to local fallback (if desired)
    }
  }

  // local fallback
  const raw = localStorage.getItem('ast_assignments')
  if (raw) assignments.value = JSON.parse(raw)
  else {
    assignments.value = [
      { id: 'a1', title: 'คณิตศาสตร์', desc: 'เรื่อง สมการเชิงเส้น', due: '', notSubmitted: [] },
      { id: 'a2', title: 'ภาษาไทย', desc: 'แต่งกลอนสี่สุภาพ', due: '', notSubmitted: [] },
    ]
    persistAssignments()
  }
}

// persistAssignments left as local fallback (no-op when using backend)
function persistAssignments() {
  if (!api.baseUrl) localStorage.setItem('ast_assignments', JSON.stringify(assignments.value))
}

// create assignment via API when possible
async function addAssignment() {
  if (!newTitle.value) return
  if (api.baseUrl) {
    try {
      const body = { title: newTitle.value, description: newDesc.value || '', due: newDue.value || null }
      if (selectedTeacherName.value) body.teacher_name = selectedTeacherName.value
      const created = await api.post('/assignments', body)
      assignments.value.unshift({
        id: created.id,
        title: created.title,
        desc: created.description || created.desc || '',
        due: created.due || created.due,
        notSubmitted: created.notSubmitted || [],
        teacher_name: created.teacher_name || null,
        teacher: null
      })
      newTitle.value = ''
      newDue.value = ''
      newDesc.value = ''
      selectedTeacherName.value = ''
      return
    } catch (e) {
      console.warn('create assignment failed:', e.message || e)
      return
    }
  }
  // local fallback
  assignments.value.unshift({ id: Date.now().toString(), title: newTitle.value, desc: newDesc.value || '', due: newDue.value || '', notSubmitted: [] })
  newTitle.value = ''
  newDue.value = ''
  newDesc.value = ''
  persistAssignments()
}

async function deleteAssignment(idx) {
  const a = assignments.value[idx]
  if (!a) return
  if (api.baseUrl) {
    try {
      await api.del(`/assignments/${a.id}`)
      assignments.value.splice(idx, 1)
      return
    } catch (e) {
      console.warn('delete assignment failed:', e.message || e)
      return
    }
  }
  // local fallback
  assignments.value.splice(idx, 1)
  persistAssignments()
}

function onDragStart(studentId) {
  draggedStudent.value = studentId
}

// add student to assignment quickly (used by "+" button)
async function addStudentToAssignment(assignmentIdx, studentId) {
  const a = assignments.value[assignmentIdx]
  if (!a) return
  if (api.baseUrl) {
    try {
      const res = await api.post(`/assignments/${a.id}/not-submitted`, { studentId })
      a.notSubmitted = (res.notSubmitted || []).map(x => String(x))
      return
    } catch (e) {
      console.warn('quick-add not-submitted failed:', e.message || e)
      return
    }
  }
  // local fallback
  const arr = a.notSubmitted || []
  const sid = String(studentId)
  if (!arr.map(x => String(x)).includes(sid)) {
    arr.push(sid)
    a.notSubmitted = arr
    persistAssignments()
  }
}

async function onDrop(assignmentIdx) {
  if (!draggedStudent.value) return
  const a = assignments.value[assignmentIdx]
  if (!a) return
  // backend call
  if (api.baseUrl) {
    try {
      const res = await api.post(`/assignments/${a.id}/not-submitted`, { studentId: draggedStudent.value })
      a.notSubmitted = (res.notSubmitted || []).map(x => String(x))
      draggedStudent.value = null
      return
    } catch (e) {
      console.warn('mark not-submitted failed:', e.message || e)
      draggedStudent.value = null
      return
    }
  }
  // local fallback
  const arr = a.notSubmitted
  if (!arr.includes(draggedStudent.value)) {
    arr.push(draggedStudent.value)
    persistAssignments()
  }
  draggedStudent.value = null
}

async function markSubmitted(assignmentIdx, studentId) {
  const a = assignments.value[assignmentIdx]
  if (!a) return
  if (api.baseUrl) {
    try {
      const res = await api.del(`/assignments/${a.id}/not-submitted/${studentId}`)
      a.notSubmitted = (res.notSubmitted || []).map(x => String(x))
      return
    } catch (e) {
      console.warn('mark submitted failed:', e.message || e)
      return
    }
  }
  // local fallback
  const arr = a.notSubmitted || []
  const sid = String(studentId)
  const i = arr.map(x => String(x)).indexOf(sid)
  if (i > -1) {
    arr.splice(i, 1)
    a.notSubmitted = arr
    persistAssignments()
  }
}

function studentNameById(id) {
  const s = students.value.find(x => x.id === id)
  return s ? s.username : 'ไม่ทราบชื่อ'
}

// ensure selectedStudentIdComputed returns string id for student users
const selectedStudentIdComputed = computed(() => {
  if (!user.value) return null
  if (user.value.role === 'student') return String(user.value.id)
  return selectedStudentId.value ? String(selectedStudentId.value) : null
})

// helper: treat studentId param (ref or value) and compare as strings
function isViewingStudent(stuId) {
  const sid = selectedStudentIdComputed.value
  return sid !== null && String(stuId) === String(sid)
}

function isStudentNotSubmitted(a, studentId) {
  // studentId may be a ref/computed (unwrapped in template) or value
  const sid = studentId && studentId.value !== undefined ? studentId.value : studentId
  if (!sid) return false
  return (a.notSubmitted || []).map(x => String(x)).includes(String(sid))
}

const viewingStudentName = computed(() => {
  const id = selectedStudentIdComputed.value
  if (!id) return '-'
  const s = students.value.find(x => x.id === id)
  return s ? s.username : '-'
})

function logout() {
  auth.logout()
  router.push({ name: 'Login' })
}

onMounted(async () => {
  await loadStudents()
  await loadAssignments()
  // when logged in as student ensure selection is their id (string)
  if (user.value && user.value.role === 'student') selectedStudentId.value = String(user.value.id)
})

// editing modal state
const editingIndex = ref(null)
const editingSelected = ref([]) // string ids

function openEdit(idx) {
  editingIndex.value = idx
  const a = assignments.value[idx]
  // clone current notSubmitted as strings
  editingSelected.value = (a.notSubmitted || []).map(x => String(x))
  // ensure student list available
  if (!students.value.length) loadStudents()
}

function closeEdit() {
  editingIndex.value = null
  // reset filters/view if desired
  resetStudentView()
}

function toggleStudentInEdit(studentId) {
  const sid = String(studentId)
  const i = editingSelected.value.indexOf(sid)
  if (i === -1) editingSelected.value.push(sid)
  else editingSelected.value.splice(i, 1)
}

async function saveEdit() {
  const idx = editingIndex.value
  if (idx === null) return
  const a = assignments.value[idx]
  const current = (a.notSubmitted || []).map(x => String(x))
  const target = editingSelected.value.slice()

  const toAdd = target.filter(x => !current.includes(x))
  const toRemove = current.filter(x => !target.includes(x))

  if (api.baseUrl) {
    // apply additions
    for (const sid of toAdd) {
      try { await api.post(`/assignments/${a.id}/not-submitted`, { studentId: sid }) } catch (e) { console.warn('add failed', e) }
    }
    // apply removals
    for (const sid of toRemove) {
      try { await api.del(`/assignments/${a.id}/not-submitted/${sid}`) } catch (e) { console.warn('remove failed', e) }
    }
    // reload assignment from server (simple approach: refetch all)
    await loadAssignments()
  } else {
    // local fallback: set directly
    a.notSubmitted = target.slice()
    persistAssignments()
  }

  closeEdit()
}

// return array of student ids to display:
// - teacher: not filtered (handled in template)
// - student: only the logged-in user's id if present
// - others: ids that correspond to known students
function visibleNotSubmitted(a) {
  if (!a || !Array.isArray(a.notSubmitted)) return []
  // student view: only show the logged-in student themself (if in list)
  if (user.value && user.value.role === 'student') {
    const sid = String(user.value.id)
    return a.notSubmitted.map(x => String(x)).includes(sid) ? [sid] : []
  }
  // default: show only ids that match known students
  return a.notSubmitted.filter(id => {
    return students.value.find(s => String(s.id) === String(id))
  }).map(x => String(x))
}

</script>
